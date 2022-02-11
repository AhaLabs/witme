#![deny(warnings)]
#![doc = include_str!("../README.md")]

use anyhow::{bail, Context, Result};
use cargo_metadata::MetadataCommand;
use clap::{crate_version, FromArgMatches, IntoApp};
use once_cell::sync::OnceCell;
use wit_bindgen_gen_ts_near::generate_typescript;

use std::{
    env,
    fs::{self, read, OpenOptions},
    io::Write,
    path::{Path, PathBuf},
    process::Command,
    time::SystemTime,
};

use crate::opt::Opt;

mod opt;

static TARGET_PATH: OnceCell<PathBuf> = OnceCell::new();

fn main() -> Result<()> {
    let target_dir = TARGET_PATH.get_or_init(get_target_dir);
    let args = env::args_os();

    let matches = Opt::into_app()
        .version(crate_version!())
        .bin_name("witme")
        // .setting(AppSettings::NoBinaryName)
        .get_matches_from(args);

    let matches =
        Opt::from_arg_matches(&matches).ok_or_else(|| anyhow::anyhow!("Command not found"))?;

    run_generate(target_dir, matches.command)
}

fn run_generate(target_dir: &Path, cli_args: opt::Command) -> Result<()> {
    anyhow::ensure!(
        Path::new("Cargo.toml").exists(),
        r#"Failed to read `Cargo.toml`.
  hint: This command only works in the manifest directory of a Cargo package."#
    );
    match cli_args {
        opt::Command::Ts { input, output } => {
            ts_from_wit_file(&input, &output.unwrap_or(PathBuf::from(".")))
        }
        opt::Command::Wit {
            args,
            output,
            prefix_file,
            prefix_string,
            typescript,
        } => {
            let check_status = Command::new("cargo")
                .arg("rustc")
                .args(args)
                .arg("--")
                .arg("--emit")
                .arg("dep-info,metadata")
                // set an always-changing cfg so we can consistently trigger recompile
                .arg("--cfg")
                .arg(format!(
                    "__witgen_recompile_trigger=\"{}\"",
                    SystemTime::UNIX_EPOCH.elapsed()?.as_millis()
                ))
                .env("WITGEN_ENABLED", "true")
                .status()?;

            if !check_status.success() {
                bail!("`cargo check` failed with status: {}", check_status);
            }

            let pattern = target_dir.join("*.wit");
            let filename = output.unwrap_or_else(|| {
                PathBuf::from(typescript.as_ref().map_or("witgen.wit", |_| "index.wit"))
            });

            let mut wit_str = format!("// This is a generated file by witgen (https://github.com/bnjjj/witgen), please do not edit yourself, you can generate a new one thanks to cargo witgen generate command. (cargo-witgen v{}) \n\n", env!("CARGO_PKG_VERSION"));

            if let Some(path) = prefix_file {
                let prefix_file = String::from_utf8(read(path)?)?;
                wit_str.push_str(&format!("{}\n\n", prefix_file));
            }
            if let Some(prefix) = prefix_string {
                wit_str.push_str(&format!("{}\n\n", prefix));
            }

            for path in glob::glob(
                pattern
                    .to_str()
                    .context("CARGO_TARGET_DIR not valid UTF-8")?,
            )? {
                let path = path?;
                let mut content = fs::read(&*path)?;
                content.push(b'\n');

                wit_str.extend(String::from_utf8(content));

                // We don't care too much if we can't remove it
                let _ = fs::remove_file(&path);
            }

            if let Some(ts_path) = typescript {
                generate_typescript(&ts_path, &wit_str)?;
            }
            write_file(&filename, &wit_str, "wit")
        }
    }
}

pub(crate) fn get_target_dir() -> PathBuf {
    let metadata = MetadataCommand::new()
        .exec()
        .expect("cannot fetch cargo metadata");

    metadata.target_directory.join("witgen").into()
}

fn write_file(path: &PathBuf, contents: &str, context_str: &str) -> Result<()> {
    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .create(true)
        .open(path)
        .expect(&format!(
            "cannot create file to generate {}",
            context_str.to_string()
        ));
    file.write_all(contents.as_bytes())
        .context("cannot write to file")?;
    file.flush().context("cannot flush file")?;
    Ok(())
}

fn ts_from_wit_file(input: &PathBuf, out_dir: &PathBuf) -> Result<()> {
    let content = String::from_utf8(fs::read(&*input)?)?;
    generate_typescript(&out_dir, &content)
}

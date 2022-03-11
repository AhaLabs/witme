#![deny(warnings)]
#![doc = include_str!("../README.md")]

use anyhow::{bail, Context, Result};
use clap::{crate_version, FromArgMatches, IntoApp};
use glob::Paths;
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

use crate::opt::WitMe;

mod embeded;
mod opt;

static TARGET_PATH: OnceCell<PathBuf> = OnceCell::new();

fn main() -> Result<()> {
    let args = env::args_os();
    let matches = WitMe::into_app()
        .version(crate_version!())
        .bin_name("witme")
        // .setting(AppSettings::NoBinaryName)
        .get_matches_from(args);

    let witme =
        WitMe::from_arg_matches(&matches).ok_or_else(|| anyhow::anyhow!("Command not found"))?;

    match witme.top_level_command {
        opt::TopLevelCommand::Near(command) => run_generate(command),
    }
}

fn execute_cargo(cargo: &str, args: &[String]) -> Result<Paths> {
    let target_dir = TARGET_PATH.get_or_init(get_target_dir);
    anyhow::ensure!(
        Path::new("Cargo.toml").exists(),
        r#"Failed to read `Cargo.toml`.
    hint: This command only works in the manifest directory of a Cargo package."#
    );
    let check_status = Command::new(cargo)
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
    let pattern = pattern
        .to_str()
        .context("CARGO_TARGET_DIR not valid UTF-8")?;

    glob::glob(pattern)
        .with_context(|| format!("failed to to find matches with pattern: {}", &pattern))
}

fn run_generate(cli_args: opt::Command) -> Result<()> {
    match cli_args {
        opt::Command::Ts { input, output } => {
            ts_from_wit_file(&input, &output.unwrap_or_else(|| PathBuf::from(".")))
        }
        opt::Command::Wit {
            args,
            output,
            prefix_file,
            prefix_string,
            typescript,
            sdk,
            standards,
        } => {
            let filename = output;

            let mut wit_str = format!("// This is a generated file by witgen (https://github.com/bnjjj/witgen), please do not edit yourself, you can generate a new one thanks to cargo witgen generate command. (witme v{}) \n\n", env!("CARGO_PKG_VERSION"));

            if sdk || standards {
                wit_str.push_str(embeded::SDK);
                if standards {
                    wit_str.push_str(embeded::STANDARDS);
                }
            }

            for path in prefix_file {
              let prefix_file = String::from_utf8(read(path)?)?;
              wit_str.push_str(&format!("{}\n\n", prefix_file));
            }
            
            for prefix in prefix_string {
                wit_str.push_str(&format!("{}\n\n", prefix));
            }

            let paths = execute_cargo("cargo", &args)?;

            for path in paths {
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
            write_file(&filename, &wit_str)
        }
    }
}

pub(crate) fn get_target_dir() -> PathBuf {
    cargo_metadata::MetadataCommand::new()
        .exec()
        .expect("cannot fetch cargo metadata")
        .target_directory
        .join("witgen")
        .into()
}

fn write_file(path: &Path, contents: &str) -> Result<()> {
    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .create(true)
        .open(path)
        .expect("cannot create file to generate wit");
    file.write_all(contents.as_bytes())
        .context("cannot write to file")?;
    file.flush().context("cannot flush file")?;
    Ok(())
}

fn ts_from_wit_file(input: &Path, out_dir: &Path) -> Result<()> {
    let content = String::from_utf8(fs::read(input)?)?;
    generate_typescript(&out_dir.to_path_buf(), &content)
}

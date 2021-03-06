use std::{
    // TODO: make PR to cargo fmt to fix the following line to just `fs,`
    fs::{self},
    io::Read,
    path::{Path, PathBuf},
    process::{Command, Stdio},
};

use anyhow::{bail, Result};
use cargo_witgen::Witgen;
use clap::Parser;
use near_sdk_witgen::ImplVisitor;
use walrus::{Module, RawCustomSection};
use wit_bindgen_gen_ts_near::generate_typescript;

use crate::embeded;

#[derive(Parser, Debug)]
#[clap(
    author = "Benjamin Coenen <benjamin.coenen@hotmail.com>, Willem Wyndham <willem@ahalabs.dev>"
)]
pub struct WitMe {
    #[clap(subcommand)]
    pub top_level_command: TopLevelCommand,
}

#[derive(Parser, Debug)]
pub enum TopLevelCommand {
    /// NEAR specific wit transformations
    #[clap(subcommand)]
    Near(NearCommand),
}

#[derive(Parser, Debug)]
pub enum NearCommand {
    /// Generate wit files
    Wit {
        #[clap(long, name = "directory", short = 't')]
        typescript: Option<PathBuf>,

        /// Include near-sdk's base wit types
        #[clap(long)]
        sdk: bool,

        /// Include near-contract-standards's base wit types.
        /// This includes the sdk's types
        #[clap(long)]
        standards: bool,

        #[clap(flatten)]
        witgen: Witgen,
    },

    /// Generate ts from wit
    Ts {
        /// Specify input wit file
        #[clap(long, short = 'i', default_value = "index.wit")]
        input: PathBuf,

        /// Specify output directory to write the generated TS
        #[clap(long, name = "directory", short = 'o', default_value = "./ts")]
        output: PathBuf,
    },
    /// Generate a json schema from ts
    Json {
        /// generate a JSON schema for given ts file
        #[clap(long, short = 'i', default_value = "ts/index.ts")]
        input: PathBuf,

        /// output for JSON schema
        #[clap(long, name = "directory", short = 'o', default_value = ".")]
        out_dir: PathBuf,

        /// Arguments to be passed to `ts-json-schema-generator`.
        ///
        /// Can mostly ignore. `-- --help` for more info
        #[clap(last = true)]
        args: Vec<String>,
    },

    /// Inject wit reference into wasm binary. If no data or file argument is provided
    /// stdin is used
    Inject {
        /// Input file of binary to transform
        #[clap(long, short = 'i')]
        input: PathBuf,

        /// Output file for transformed binary
        #[clap(long, short = 'o')]
        output: PathBuf,

        /// Data to write to custom section
        #[clap(long, short = 'd')]
        data: Option<String>,

        /// Data from file to write to custom section
        #[clap(long, short = 'f')]
        file: Option<PathBuf>,

        /// Name of custom section
        #[clap(long, short = 'n', default_value = "json")]
        name: String,
    },
}

impl WitMe {
    pub fn run(self) -> Result<()> {
        match self.top_level_command {
            TopLevelCommand::Near(command) => command.run(),
        }
    }
}

impl NearCommand {
    pub fn run(self) -> Result<()> {
        match self {
            NearCommand::Ts { input, output } => ts_from_wit_file(&input, &output),
            NearCommand::Wit {
                witgen,
                typescript,
                sdk,
                standards,
                ..
            } => {
                let mut input = witgen.read_input()?;
                let mut items = ImplVisitor::find_items_in_file(&input);
                input.items.append(&mut items);
                let mut wit_str = witgen.generate_str(input)?;
                if sdk || standards {
                    wit_str.push_str(embeded::SDK);
                    if standards {
                        wit_str.push_str(embeded::STANDARDS);
                    }
                }

                if let Some(ts_path) = typescript {
                    generate_typescript(&ts_path, &wit_str)?;
                }
                witgen.write_output(&wit_str)
            }
            NearCommand::Json {
                input,
                out_dir,
                args,
            } => generate_json_schema(&input, &out_dir, args),
            NearCommand::Inject {
                input,
                output,
                data,
                file,
                name,
            } => inject_wit(&input, &output, name, get_data(data, file)?),
        }
    }
}

fn ts_from_wit_file(input: &Path, out_dir: &Path) -> Result<()> {
    let content = String::from_utf8(fs::read(input)?)?;
    generate_typescript(out_dir, &content)
}

fn generate_json_schema(input: &Path, out_dir: &Path, args: Vec<String>) -> Result<()> {
    Command::new("npx")
        .arg("ts-json-schema-generator")
        .arg("-p")
        .arg(input)
        .arg("--validation-keywords")
        .arg("contractMethod")
        .arg("--validation-keywords")
        .arg("allow")
        .arg("--no-type-check")
        .arg("-o")
        .arg(out_dir.join("index.schema.json"))
        .args(args)
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .output()
        .expect("failed to execute process");
    Ok(())
}

fn get_data(data: Option<String>, file: Option<PathBuf>) -> Result<Vec<u8>> {
    match (data, file) {
        (Some(s), None) => Ok(s.as_bytes().to_vec()),
        (None, Some(f)) => fs::read(f).map_err(anyhow::Error::from),
        (None, None) => read_stdin(),
        _ => bail!("Cannot use both 'data' and 'file' arguments"),
    }
}

fn read_stdin() -> Result<Vec<u8>> {
    let mut buf = vec![];
    std::io::stdin()
        .lock()
        .read_to_end(&mut buf)
        .map_err(anyhow::Error::from)?;
    Ok(buf)
}

/// Inject data into a custom section
pub fn inject_wit(input: &Path, output: &Path, name: String, data: Vec<u8>) -> Result<()> {
    let mut module = Module::from_file(input)?;
    module.customs.add(RawCustomSection { name, data });
    module.emit_wasm_file(output)
}

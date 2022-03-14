use clap::Parser;
use std::path::PathBuf;

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
    Near(Command),
}

#[derive(Parser, Debug)]
pub enum Command {
    /// Generate wit files
    Wit {
        /// Specify output file to generate wit definitions
        #[clap(long, short = 'o', default_value = "index.wit")]
        output: PathBuf,

        /// Arguments to be passed to `cargo rustc ...`.
        /// Can mostly ignore.
        #[clap(last = true)]
        args: Vec<String>,

        /// Specify prefix file to copy into top of the generated wit file
        #[clap(long, name = "path to wit", short = 'p')]
        prefix_file: Vec<PathBuf>,

        /// Specify prefix string to copy into top of the generated wit file
        ///
        /// `--prefix-string 'use * from "string.wit"'`
        #[clap(long, short = 's')]
        prefix_string: Vec<String>,


        #[clap(long, name = "directory", short = 't')]
        typescript: Option<PathBuf>,

        /// Include near-sdk's base wit types
        #[clap(long)]
        sdk: bool,

        /// Include near-contract-standards's base wit types.
        /// This includes the sdk's types
        #[clap(long)]
        standards: bool,
    },

    /// Generate ts file from wit
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
    }
}

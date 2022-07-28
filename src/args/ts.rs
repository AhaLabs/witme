use super::Runnable;
use anyhow::{Context, Result};
use std::{fs, path::PathBuf};
use wit_bindgen_gen_ts_near::generate_typescript;

#[derive(Debug, clap::Args)]
pub struct Ts {
    /// Specify input wit file
    #[clap(long, short = 'i', default_value = "index.wit", action)]
    input: PathBuf,

    /// Specify output directory to write the generated TS
    #[clap(long, name = "directory", short = 'o', default_value = "./ts", action)]
    output: PathBuf,
}

impl Runnable for Ts {
    fn run(self) -> Result<()> {
        let Self { input, output } = self;
        let content =
            String::from_utf8(fs::read(&input).context(format!("Error with file {:#?}", input))?)?;
        generate_typescript(&output, &content)
    }
}

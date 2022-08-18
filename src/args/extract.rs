use crate::util::{write_file_or_stdout, Wasm, Compressable};

use super::Runnable;
use std::{
    path::{ PathBuf},
};


#[derive(Debug, clap::Args)]
pub struct Extract {
    /// Input Wasm binary to extract from else stdin will be used
    #[clap(long, short = 'i', action)]
    input: Option<PathBuf>,

    /// Output file for extracted data else stdout will be used
    #[clap(long, short = 'o', action)]
    output: Option<PathBuf>,

    /// Name of custom section to extract
    #[clap(long, short = 'n', default_value = "json", action)]
    name: String,

    /// Decompress Contents
    #[clap(long, short = 'd', action)]
    decompress: bool,
}

impl Runnable for Extract {
    fn run(self) -> anyhow::Result<()> {
        let Self {
            input,
            output,
            name,
            decompress,
        } = self;
        let mut data = Wasm::new(input)?.extract_custom_section(&name)?;
        if decompress {
          data = data.decompress()?;
        }
        write_file_or_stdout(&output.as_deref(), &data)
    }
}




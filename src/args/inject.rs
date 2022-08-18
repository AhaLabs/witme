use crate::util::{read_stdin, write_file_or_stdout, Compressable, Wasm};

use super::Runnable;
use anyhow::{bail, Result};
use std::{fs, path::PathBuf};

#[derive(Debug, clap::Args)]
pub struct Inject {
    /// Input file of binary to transform. Stdin is used if nothing is passed.
    #[clap(long, short = 'i', action)]
    input: Option<PathBuf>,

    /// Output file for transformed binary. Stdout is used if none is provided
    #[clap(long, short = 'o', action)]
    output: Option<PathBuf>,

    /// Data to write to custom section
    #[clap(long, short = 'd', action)]
    data: Option<String>,

    /// Data from file to write to custom section
    #[clap(long, short = 'f', action)]
    file: Option<PathBuf>,

    /// Name of custom section
    #[clap(long, short = 'n', default_value = "json", action)]
    name: String,

    /// Compress data using brotli compression
    #[clap(long, short = 'c', action)]
    compress: bool,
}

impl Runnable for Inject {
    fn run(self) -> anyhow::Result<()> {
        let Self {
            input,
            output,
            data,
            file,
            name,
            compress,
        } = self;
        let mut data = get_data(data, file)?;
        if compress {
            data = data.compress()?;
        }
        let wasm = Wasm::new(input)?.inject_custom_section(name, data)?;
        write_file_or_stdout(&output.as_deref(), &wasm.emit()?)
    }
}

fn get_data(data: Option<String>, file: Option<PathBuf>) -> Result<Vec<u8>> {
    match (data, file) {
        (Some(s), None) => Ok(s.as_bytes().to_vec()),
        (None, Some(f)) => fs::read(f).map_err(anyhow::Error::from),
        (None, None) => read_stdin(),
        _ => bail!("Cannot use both 'data' and 'file' arguments"),
    }
}

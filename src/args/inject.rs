use super::Runnable;
use anyhow::{bail, Result};
use std::{
    fs,
    io::Read,
    path::{Path, PathBuf},
};
use walrus::{Module, RawCustomSection};

#[derive(Debug, clap::Args)]
pub struct Inject {
    /// Input file of binary to transform
    #[clap(long, short = 'i', action)]
    input: PathBuf,

    /// Output file for transformed binary
    #[clap(long, short = 'o', action)]
    output: PathBuf,

    /// Data to write to custom section
    #[clap(long, short = 'd', action)]
    data: Option<String>,

    /// Data from file to write to custom section
    #[clap(long, short = 'f', action)]
    file: Option<PathBuf>,

    /// Name of custom section
    #[clap(long, short = 'n', default_value = "json", action)]
    name: String,
}

impl Runnable for Inject {
    fn run(self) -> anyhow::Result<()> {
        let Self {
            input,
            output,
            data,
            file,
            name,
        } = self;
        inject_wit(&input, &output, name, get_data(data, file)?)
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

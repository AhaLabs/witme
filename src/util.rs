use anyhow::{Context, Result, bail};
use brotli::BrotliDecompress;
use std::{
    fs::OpenOptions,
    io::{Read, Write},
    path::{Path, PathBuf}, ops::DerefMut,
};
use walrus::{Module, RawCustomSection};

pub fn read_stdin() -> Result<Vec<u8>> {
    let mut buf = vec![];
    std::io::stdin()
        .lock()
        .read_to_end(&mut buf)
        .map_err(anyhow::Error::from)?;
    Ok(buf)
}

pub fn write_stdout(buf: &[u8]) -> Result<()> {
    std::io::stdout()
        .lock()
        .write_all(buf)
        .context("cannot write to stdout")
}

pub fn write_file_or_stdout(path: Option<&Path>, contents: &[u8]) -> Result<()> {
    if let Some(path) = path {
        write_file(path, contents)
    } else {
        write_stdout(contents)
    }
}

pub fn write_file(path: &Path, contents: &[u8]) -> Result<()> {
    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .create(true)
        .open(path)
        .with_context(|| format!("cannot open {}", path.display()))?;
    file.write_all(contents)
        .with_context(|| format!("cannot write to file: {}", path.display()))?;
    file.flush()
        .with_context(|| format!("cannot flush file: {}", path.display()))?;
    Ok(())
}

pub enum Wasm {
    File(PathBuf),
    Data(Vec<u8>),
    Mod(Module),
}

impl Wasm {
    pub fn new(input: Option<PathBuf>) -> Result<Self> {
        Ok(match input.as_ref() {
            Some(f) => Wasm::File(f.clone()),
            None => Wasm::Data(read_stdin()?),
        })
    }

    pub fn extract_custom_section(&self, name: &str) -> Result<Vec<u8>> {
      let module: Module = self.try_into()?;
      for section in module.customs.iter() {
        let section = section.1;
        if section.name() == name {
            return Ok(section.data(&Default::default()).to_vec());
        }
    }
    bail!("No custom section: {}", name)
    }

    pub fn inject_custom_section(&self, name: String, data: Vec<u8>) -> Result<Self> {
      let mut module: Module = self.try_into()?;
      module.customs.add(RawCustomSection { name, data });
      Ok(Wasm::Mod(module))
    }

    pub fn emit(self) -> Result<Vec<u8>> { 
      match self {
        Wasm::Data(bytes) => Ok(bytes),
        Wasm::Mod(mut module) => Ok(module.emit_wasm()),
        Wasm::File(_) => bail!("cannot emit file"),
    }
    }
}

impl TryInto<Module> for &Wasm {
    type Error = anyhow::Error;

    fn try_into(self) -> Result<Module, Self::Error> {
        match self {
            Wasm::File(path) => Module::from_file(path)
                .with_context(|| format!("Error reading wasm file: {}", path.display())),
            Wasm::Data(data) => Module::from_buffer(&data),
            Wasm::Mod(_) => bail!("already contains module"),
        }
    }
}

pub trait Compressable {
    fn compress(&mut self) -> Result<Vec<u8>>;
    fn decompress(&self) -> Result<Vec<u8>>;
}

impl Compressable for Vec<u8> {
    fn decompress(&self) -> Result<Vec<u8>> {
        let mut result = Vec::new();
        BrotliDecompress(&mut self.as_slice(), &mut result)?;
        Ok(result)
    }

    fn compress(&mut self) -> Result<Vec<u8>> {
        compress_data(self.deref_mut())
    }
}

pub fn compress_data(data: &mut [u8]) -> Result<Vec<u8>> {
    let mut out = Vec::<u8>::new();
    let params = brotli::enc::BrotliEncoderParams {
        quality: 11,
        ..Default::default()
    };

    brotli::BrotliCompress(&mut data.as_ref(), &mut out, &params)?;
    Ok(out)
}

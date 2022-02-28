use std::path::PathBuf;

use crate::Ts;
use anyhow::{Context, Result};
use wit_bindgen_gen_core::{wit_parser::Interface, Files, Generator};

pub fn generate_typescript(ts_path: &PathBuf, wit_str: &str) -> Result<()> {
    let mut generator: Box<dyn Generator> = Box::new(Ts::new());
    let mut files = Files::default();
    let path = ts_path.as_path();
    let path_str = ts_path.to_str().unwrap();
    let (dir, file_stem) = if path_str.ends_with(".ts") {
        (
            path.parent().unwrap(),
            path.file_name().unwrap().to_str().unwrap(),
        )
    } else {
        (path, "index.ts")
    };

    let imports = [parse(file_stem, wit_str)?];
    generator.generate_all(&imports, &[], &mut files);
    for (name, contents) in files.iter() {
        let dst = dir.join(name);
        println!("Generating {:?}", dst);
        if let Some(parent) = dst.parent() {
            std::fs::create_dir_all(parent)
                .with_context(|| format!("failed to create {:?}", parent))?;
        }
        std::fs::write(&dst, contents).with_context(|| format!("failed to write {:?}", dst))?;
    }
    Ok(())
}

fn parse(name: &str, wit_str: &str) -> Result<Interface> {
    match Interface::parse(name, &wit_str) {
        i @ Ok(_) => i,
        e @ Err(_) => {
            eprintln!("You probably need to add a `witgen` macro to the missing type");
            e
        }
    }
}

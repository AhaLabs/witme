use anyhow::Context;
use std::{fs, path::PathBuf};
use wit_bindgen_gen_json_schema::gen::generate_json;

use super::Runnable;

#[derive(Debug, clap::Args)]
pub struct Json {
    /// generate a JSON schema for given ts file
    #[clap(long, short = 'i', default_value = "ts/index.ts", action)]
    input: PathBuf,

    /// output for JSON schema
    #[clap(long, name = "directory", short = 'o', default_value = ".", action)]
    out_dir: PathBuf,

    /// Arguments to be passed to `ts-json-schema-generator`.
    ///
    /// Can mostly ignore. `-- --help` for more info
    #[clap(last = true, action)]
    args: Vec<String>,
}

impl Runnable for Json {
    fn run(self) -> anyhow::Result<()> {
        let Self { input, out_dir, .. } = self;
        let content =
            String::from_utf8(fs::read(&input).context(format!("Error with file {:#?}", input))?)?;
        generate_json(&out_dir, &content)
    }
}

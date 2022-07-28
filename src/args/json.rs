use std::{path::PathBuf, process::{Command, Stdio}};

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
        let Self {
            input,
            out_dir,
            args,
        } = self;
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
}

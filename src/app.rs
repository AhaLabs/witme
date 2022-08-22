use anyhow::Result;
use cargo_witgen::Witgen;
use clap::Parser;

use crate::args::{Extract, Inject, Json, Runnable, Ts, Wit};

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

    /// Inject data into wasm custom section
    Inject(Inject),

    /// Extract data from wasm custom section
    Extract(Extract),

    /// Generate Wit from source code (currently only rust)
    #[clap(alias = "gen")]
    Generate(Witgen),
}

#[derive(Parser, Debug)]
pub enum NearCommand {
    /// Generate wit files
    Wit(Wit),

    /// Generate ts from wit
    Ts(Ts),

    /// Generate a json schema from wit
    Json(Json),
}

impl WitMe {
    pub fn run(self) -> Result<()> {
        match self.top_level_command {
            TopLevelCommand::Near(command) => command.run(),
            TopLevelCommand::Inject(inject) => inject.run(),
            TopLevelCommand::Extract(extract) => extract.run(),
            TopLevelCommand::Generate(witgen) => witgen.run(),
        }
    }
}

impl NearCommand {
    pub fn run(self) -> Result<()> {
        match self {
            NearCommand::Ts(ts) => ts.run(),
            NearCommand::Wit(wit) => wit.run(),
            NearCommand::Json(json) => json.run(),
        }
    }
}

use anyhow::Result;
use clap::Parser;

use crate::args::{Inject, Json, Runnable, Ts, Wit};

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
}

#[derive(Parser, Debug)]
pub enum NearCommand {
    /// Generate wit files
    Wit(Wit),

    /// Generate ts from wit
    Ts(Ts),
    /// Generate a json schema from wit
    Json(Json),

    /// Inject wit reference into wasm binary. If no data or file argument is provided
    /// stdin is used
    Inject(Inject),
}

impl WitMe {
    pub fn run(self) -> Result<()> {
        match self.top_level_command {
            TopLevelCommand::Near(command) => command.run(),
        }
    }
}

impl NearCommand {
    pub fn run(self) -> Result<()> {
        match self {
            NearCommand::Ts(ts) => ts.run(),
            NearCommand::Wit(wit) => wit.run(),
            NearCommand::Json(json) => json.run(),
            NearCommand::Inject(inject) => inject.run(),
        }
    }
}

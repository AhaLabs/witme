// #![deny(warnings)]
#![doc = include_str!("../README.md")]
use std::env;

use anyhow::{Context, Result};
use clap::{crate_version, FromArgMatches, IntoApp};


mod app;
mod embeded;
mod near;
use crate::app::WitMe;

fn main() -> Result<()> {
    let args = env::args_os();
    let matches = WitMe::command()
        .version(crate_version!())
        .bin_name("witme")
        // .setting(AppSettings::NoBinaryName)
        .get_matches_from(args);

    WitMe::from_arg_matches(&matches)
        .context("Command not found")?
        .run()
}

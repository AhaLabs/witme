use anyhow::Result;
use cargo_witgen::Witgen;
use near_sdk_witgen::ImplVisitor;
use wit_bindgen_gen_ts_near::generate_typescript;
use std::path::PathBuf;

use crate::embeded;

use super::Runnable;

#[derive(Debug, clap::Args)]
pub struct Wit {
    #[clap(long, name = "directory", short = 't', action)]
    typescript: Option<PathBuf>,

    /// Include near-sdk's base wit types
    #[clap(long, action)]
    sdk: bool,

    /// Include near-contract-standards's base wit types.
    /// This includes the sdk's types
    #[clap(long, action)]
    standards: bool,

    #[clap(flatten)]
    witgen: Witgen,
}



impl Runnable for Wit {
    fn run(self) -> Result<()> {
        let Self {
            witgen,
            typescript,
            sdk,
            standards,
        } = self;
        let mut input = witgen.read_input()?;
        let mut items = ImplVisitor::find_items_in_file(&input);
        input.items.append(&mut items);
        let mut wit_str = witgen.generate_str(input)?;
        if sdk || standards {
            wit_str.push_str(embeded::SDK);
            if standards {
                wit_str.push_str(embeded::STANDARDS);
            }
        }

        if let Some(ts_path) = typescript {
            generate_typescript(&ts_path, &wit_str)?;
        }
        witgen.write_output(&wit_str)
    }
}

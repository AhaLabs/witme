use clap::Parser;
use std::path::PathBuf;

#[derive(Parser, Debug)]
#[clap(
    author = "Benjamin Coenen <benjamin.coenen@hotmail.com>, Willem Wyndham <willem@ahalabs.dev>"
)]
pub struct WitMe {
    // #[clap(flatten)]
    // global_opts: GlobalOpts,
    #[clap(subcommand)]
    pub top_level_command: TopLevelCommand,
}

#[derive(Parser, Debug)]
pub enum TopLevelCommand {
    /// NEAR specific wit operations
    #[clap(subcommand)]
    Near(Command),
}

#[derive(Parser, Debug)]
pub enum Command {
    /// Generate wit files
    Wit {
        /// Specify output file to generate wit definitions
        ///
        /// Default: './witgen.wit`
        #[clap(long, short = 'o')]
        output: Option<PathBuf>,

        /// Arguments to be passed to `cargo rustc ...`.
        /// Can mostly ignore.
        #[clap(last = true)]
        args: Vec<String>,

        /// Specify prefix file to copy into top of the generated wit file
        #[clap(long, name = "path to wit", short = 'p')]
        prefix_file: Option<PathBuf>,

        /// Specify prefix string to copy into top of the generated wit file
        ///
        /// `--prefix-string 'use * from "string.wit"'`
        #[clap(long, short = 's')]
        prefix_string: Option<String>,

        /// Generate TypeScript file from generated wit file in one step
        ///  
        /// `-t ./dist` --> `./dist/index.ts`
        ///
        /// `-t ./dist/file.ts` --> `./dist/file.ts`
        #[clap(long, name = "file or directory", short = 't')]
        typescript: Option<PathBuf>,

        /// Include near-sdk's base wit types
        #[clap(long)]
        sdk: bool,

        /// Include near-contract-standards's base wit types.
        /// This includes the sdk's types
        #[clap(long)]
        standards: bool,
    },

    /// Generate ts file from wit
    Ts {
        /// Specify input wit file
        #[clap(long, short = 'i')]
        input: PathBuf,

        /// Specify output file or directory to write the generated TS
        ///
        /// `-o ./dist` --> `./dist/index.ts`
        ///
        /// `-o ./dist/file.ts` --> `./dist/file.`ts
        #[clap(long, name = "file or directory", short = 'o')]
        output: Option<PathBuf>,
    },
}

// #[derive(Debug, Args)]
// struct GlobalOpts {
//     /// Color
//     #[clap(long, arg_enum, global = true)]
//     color: Color,
//     // /// Verbosity level (can be specified multiple times)
//     // #[clap(long, short, global = true, parse(from_occurrences))]
//     // verbose: usize,
//     //... other global options
// }

// #[derive(Clone, Display, Debug, ArgEnum)]
// enum Color {
//     Always,
//     Auto,
//     Never,
// }

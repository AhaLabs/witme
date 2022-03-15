use assert_cmd::Command;
use assert_fs::prelude::*;

use anyhow::Result;

fn wit_cmd<'a>() -> Result<Command> {
    Ok(Command::cargo_bin("witme")?)
}

#[test]
fn help_case() -> Result<()> {
    let mut command = wit_cmd()?;
    println!(
        "{:#?}",
        command
            .current_dir("./examples/counter")
            .arg("near")
            .arg("wit")
    );
    Ok(())
}

#[test]
fn simple_case() -> Result<()> {
    let mut command = wit_cmd()?;
    println!("{:#?}", std::env::current_dir()?);
    let temp = assert_fs::TempDir::new().unwrap();
    let file = temp.child("index.wit");
    command
        .current_dir("./examples/counter")
        .arg("near")
        .arg("wit")
        .arg("-o")
        .arg(temp.join("index.wit"))
        .unwrap();
    file.assert(predicates::str::contains("get-num: function() -> s8"));
    Ok(())
}

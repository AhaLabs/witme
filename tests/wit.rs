use assert_cmd::Command;
use assert_fs::{prelude::*};
use std::{fs, io::Read};
use anyhow::Result;

fn cmd<'a>() -> Result<Command> {
    Ok(Command::cargo_bin("witme")?)
}

#[test]
fn help_case() -> Result<()> {
    let mut command = cmd()?;
    println!(
        "{:#?}",
        command
            .current_dir("./examples/counter")
            .arg("near")
            .arg("wit")
    );
    Ok(())
}



fn near_cmd<'a>(example: &str) -> Result<Command> {
    let mut c = cmd()?;
    c.current_dir(&format!("./examples/{example}")).arg("near");
    Ok(c)
}

fn wit_cmd(example: &str) -> Result<Command> {
    let mut c = near_cmd(example)?;
    c.arg("wit");
    Ok(c)
}

fn test_example_wit(example: &str) -> Result<()> {
    let temp = assert_fs::TempDir::new().unwrap();
    let file = temp.child("index.wit");
    (&mut wit_cmd(example)?)
        .arg("-o")
        .arg(temp.join("index.wit"))
        .arg("--sdk")
        .unwrap();
    // file.assert(predicates::str::contains("get-num: function() -> s8"));
    let mut f =
        fs::File::open(std::env::current_dir()?.join(&format!("examples/{example}/index.wit")))?;
    let mut actual_file = fs::File::open(&file)?;
    let mut contents = String::new();
    let mut actual = String::new();
    f.read_to_string(&mut contents)?;
    actual_file.read_to_string(&mut actual)?;
    let contents_vec = contents.split('\n').collect::<Vec<&str>>().sort();
    let actual_vec = actual.split('\n').collect::<Vec<&str>>().sort();
    assert_eq!(contents_vec, actual_vec);
    // let mut left = parse_wit_str(&actual)?;
    // let mut right = parse_wit_str(&contents)?;

    // assert_eq!(&format!("{:#?}", left), &format!("{:#?}", right));

    Ok(())
}

#[test]
fn counter_wit() -> Result<()> {
    test_example_wit("counter")
}

#[test]
fn status_message_wit() -> Result<()> {
    test_example_wit("rust-status-message")
}

#[test]
fn simple_wit() -> Result<()> {
    test_example_wit("simple")
}

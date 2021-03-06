#![allow(dead_code, unused_variables)]
use std::collections::HashMap;

mod extra_type;
use extra_type::*;

use witgen::witgen;

#[witgen]
enum MyEnum {
    Unit,
    TupleVariant(String, i32),
}

/// Example of using generating an enum, e.i. a variant with unit fields
#[witgen]
enum Color {
    Red,
    Green,
    Blue,
}

#[witgen]
fn test_simple(array: Vec<u8>) -> String {
    String::from("test")
}

#[witgen]
type NFTContractMetadata = String;

#[witgen]
pub struct InitArgs {
    owner_id: String,
    metadata: NFTContractMetadata,
}

#[witgen]
fn test_array(other: [u8; 32], number: u8, othernum: i32) -> (String, usize) {
    (String::from("test"), 0usize)
}

#[witgen]
fn test_vec(other: Vec<u8>, number: u8, othernum: i32) -> (String, usize) {
    (String::from("test"), 0usize)
}

#[witgen]
fn test_option(other: Vec<u8>, number: u8, othernum: i32) -> Option<(String, usize)> {
    Some((String::from("test"), 0usize))
}

#[witgen]
fn test_result(other: Vec<u8>, number: u8, othernum: i32) -> Result<(String, usize), String> {
    Ok((String::from("test"), 0usize))
}

#[witgen]
/// Here is a doc example to generate in wit file
struct TestBis {
    coucou: String,
    btes: Vec<u8>,
}

#[witgen]
/// Documentation over struct
/// in multi-line
struct TestTuple(usize, String);

#[witgen]
struct TestStruct {
    /// Doc comment over inner field in struct
    inner: String,
}

/// Documentation over enum
#[witgen]
enum TestEnum {
    /// Doc comment over Unit variant in enum
    Unit,
    Number(u64),
    /// Doc comment over String variant
    StringVariant(String),
}

/// Documentation over enum
#[witgen]
enum ComplicatedEnum {
    /// Doc comment over Unit variant in enum
    HashFields {
        name: String,
        kind: TestEnum,
    },
    Number {
        size: u32,
    },
    /// Doc comment over String variant in enum
    StringVariant {
        /// Can document fields
        inner: String,
    },
}

#[witgen]
fn test_tuple_fn(other: Vec<u8>, test_struct: TestStruct, other_enum: TestEnum) -> (String, i64) {
    (String::from("test"), 0i64)
}

#[witgen]
struct HasHashMap {
    map: HashMap<String, TestStruct>,
}

#[witgen]
fn use_string_alias(s: StringAlias) -> StringAlias {
    s
}

#[witgen]
fn has_mutable(mut s: String) -> String {
    s = s + &"hello".to_string();
    s
}

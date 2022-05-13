
import {
  u8,
  i8,
  u16,
  i16,
  u32,
  i32,
  u64,
  i64,
  f32,
  f64,
  CallOptions,
  TestStruct,
  HasHashMap,
  Base64VecU8,
  AccountId,
  U128,
  TestTuple,
  ComplicatedEnumStringVariant,
  MyEnum,
  StringAlias,
  Balance,
  Duration,
  ComplicatedEnumNumber,
  TestBis,
  Gas,
  Timestamp,
  ComplicatedEnumHashFields,
  PublicKey,
  Result,
  StorageUsage,
  NftContractMetadata,
  InitArgs,
  TestEnum,
  ComplicatedEnum,
  Color,
} from "./types";

/**
* 
* @contractMethod view
*/
export interface TestSimple {
  args: {
    array: Uint8Array;
  };
  
}
export type TestSimple__Result = string;
/**
* 
* @contractMethod view
*/
export interface TestArray {
  args: {
    other: Uint8Array;
    number: u8;
    othernum: i32;
  };
  
}
export type TestArray__Result = [string, u64];
/**
* 
* @contractMethod view
*/
export interface TestVec {
  args: {
    other: Uint8Array;
    number: u8;
    othernum: i32;
  };
  
}
export type TestVec__Result = [string, u64];
/**
* 
* @contractMethod view
*/
export interface TestOption {
  args: {
    other: Uint8Array;
    number: u8;
    othernum: i32;
  };
  
}
export type TestOption__Result = [string, u64] | null;
/**
* 
* @contractMethod view
*/
export interface TestResult {
  args: {
    other: Uint8Array;
    number: u8;
    othernum: i32;
  };
  
}
export type TestResult__Result = Result<[string, u64], string>;
/**
* 
* @contractMethod view
*/
export interface TestTupleFn {
  args: {
    other: Uint8Array;
    test_struct: TestStruct;
    other_enum: TestEnum;
  };
  
}
export type TestTupleFn__Result = [string, i64];
/**
* 
* @contractMethod view
*/
export interface UseStringAlias {
  args: {
    s: StringAlias;
  };
  
}
export type UseStringAlias__Result = StringAlias;
/**
* 
* @contractMethod view
*/
export interface HasMutable {
  args: {
    s: string;
  };
  
}
export type HasMutable__Result = string;

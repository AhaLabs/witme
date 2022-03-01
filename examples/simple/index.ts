import { Account, transactions, providers, DEFAULT_FUNCTION_CALL_GAS } from 'near-api-js';


import BN from 'bn.js';
export interface ChangeMethodOptions {
  gas?: BN;
  attachedDeposit?: BN;
  walletMeta?: string;
  walletCallbackUrl?: string;
}
export interface ViewFunctionOptions {
  parse?: (response: Uint8Array) => any;
  stringify?: (input: any) => any;
}

/** 
* @minimum 0
* @maximum 18_446_744_073_709_551_615
* @TJS-integer
*/
type u64 = number;
/** 
* @minimum -9_223_372_036_854_775_808
* @maximum 9_223_372_036_854_775_807
* @TJS-integer
*/
type i64 = number;

/**
* @minimum  0 
* @maximum 255
* @TJS-integer
* */
type u8 = number;
/**
* @minimum  -128 
* @maximum 127
* @TJS-integer
* */
type i8 = number;
/**
* @minimum  0 
* @maximum 65_535
* @TJS-integer
* */
type u16 = number;
/**
* @minimum -32_768 
* @maximum 32_767
* @TJS-integer
* */
type i16 = number;
/**
* @minimum 0 
* @maximum 4_294_967_295
* @TJS-integer
* */
type u32 = number;
/**
* @minimum 0 
* @maximum 4_294_967_295
* @TJS-integer
* */
type usize = number;
/**
* @minimum  -2_147_483_648 
* @maximum 2_147_483_647
* @TJS-integer
* */
type i32 = number;
export type StringAlias = string;
/**
* Documentation over enum
*/
export type TestEnum = TestEnumUnit | TestEnumNumber | TestEnumStringVariant;
/**
* Doc comment over Unit variant in struct
*/
export interface TestEnumUnit {
  tag: "unit",
}
export interface TestEnumNumber {
  tag: "number",
  val: u64,
}
/**
* Doc comment over String variant in struct
*/
export interface TestEnumStringVariant {
  tag: "string-variant",
  val: string,
}
export type MyEnum = MyEnumUnit | MyEnumTupleVariant;
export interface MyEnumUnit {
  tag: "unit",
}
export interface MyEnumTupleVariant {
  tag: "tuple-variant",
  val: [string, i32],
}
/**
* Example of using generating an enum, e.i. a variant with unit fields
*/
export enum Color {
  Red = "Red",
  Green = "Green",
  Blue = "Blue",
}
export interface InitArgs {
  owner_id: string,
  metadata: NftContractMetadata,
}
/**
* Documentation over struct
* in multi-line
*/
export type TestTuple = [u64, string];
export interface TestStruct {
  /**
  * Doc comment over inner field in struct
  */
  inner: string,
}
export interface HasHashMap {
  map: Record<string, TestStruct>,
}
export type NftContractMetadata = string;
/**
* Here is a doc example to generate in wit file
*/
export interface TestBis {
  coucou: string,
  btes: Uint8Array,
}

export class Contract {
  
  constructor(public account: Account, public readonly contractId: string){}
  
  test_simple(args: {
    array: Uint8Array,
  }, options?: ViewFunctionOptions): Promise<string> {
    return this.account.viewFunction(this.contractId, "test_simple", args, options);
  }
  use_string_alias(args: {
    s: StringAlias,
  }, options?: ViewFunctionOptions): Promise<StringAlias> {
    return this.account.viewFunction(this.contractId, "use_string_alias", args, options);
  }
  test_tuple(args: {
    other: Uint8Array,
    test_struct: TestStruct,
    other_enum: TestEnum,
  }, options?: ViewFunctionOptions): Promise<[string, i64]> {
    return this.account.viewFunction(this.contractId, "test_tuple", args, options);
  }
  test_result(args: {
    other: Uint8Array,
    number: u8,
    othernum: i32,
  }, options?: ViewFunctionOptions): Promise<Result<[string, u64], string>> {
    return this.account.viewFunction(this.contractId, "test_result", args, options);
  }
  test_option(args: {
    other: Uint8Array,
    number: u8,
    othernum: i32,
  }, options?: ViewFunctionOptions): Promise<[string, u64] | null> {
    return this.account.viewFunction(this.contractId, "test_option", args, options);
  }
  has_mutable(args: {
    s: string,
  }, options?: ViewFunctionOptions): Promise<string> {
    return this.account.viewFunction(this.contractId, "has_mutable", args, options);
  }
  test_array(args: {
    other: Uint8Array,
    number: u8,
    othernum: i32,
  }, options?: ViewFunctionOptions): Promise<[string, u64]> {
    return this.account.viewFunction(this.contractId, "test_array", args, options);
  }
  test_vec(args: {
    other: Uint8Array,
    number: u8,
    othernum: i32,
  }, options?: ViewFunctionOptions): Promise<[string, u64]> {
    return this.account.viewFunction(this.contractId, "test_vec", args, options);
  }
}
export type Result<T, E> = { tag: "ok", val: T } | { tag: "err", val: E };

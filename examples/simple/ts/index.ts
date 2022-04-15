import {
  Account,
  transactions,
  providers,
  DEFAULT_FUNCTION_CALL_GAS,
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
  BN,
  ChangeMethodOptions,
  ViewFunctionOptions,
} from './helper';

export type StringAlias = string;
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
export type NftContractMetadata = string;
export interface InitArgs {
  owner_id: string;
  metadata: NftContractMetadata;
}
/**
* Here is a doc example to generate in wit file
*/
export interface TestBis {
  coucou: string;
  btes: Uint8Array;
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
  inner: string;
}
/**
* Documentation over enum
*/
export type TestEnum = TestEnumUnit | TestEnumNumber | TestEnumStringVariant;
/**
* Doc comment over Unit variant in enum
*/
export interface TestEnumUnit {
  tag: "unit",
}
export interface TestEnumNumber {
  tag: "number",
  val: u64,
}
/**
* Doc comment over String variant
*/
export interface TestEnumStringVariant {
  tag: "string-variant",
  val: string,
}
/**
* Documentation over enum
*/
export type ComplicatedEnum = ComplicatedEnumHashFields | ComplicatedEnumNumber | ComplicatedEnumStringVariant;
/**
* Doc comment over Unit variant in enum
*/
export interface ComplicatedEnumHashFields {
  tag: "hash-fields",
  val: ComplicatedEnumHashFields,
}
export interface ComplicatedEnumNumber {
  tag: "number",
  val: ComplicatedEnumNumber,
}
/**
* Doc comment over String variant in enum
*/
export interface ComplicatedEnumStringVariant {
  tag: "string-variant",
  val: ComplicatedEnumStringVariant,
}
/**
* Doc comment over Unit variant in enum
*/
export interface ComplicatedEnumHashFields {
  name: string;
  kind: TestEnum;
}
export interface ComplicatedEnumNumber {
  size: u32;
}
/**
* Doc comment over String variant in enum
*/
export interface ComplicatedEnumStringVariant {
  /**
  * Can document fields
  */
  inner: string;
}
export interface HasHashMap {
  map: Record<string, TestStruct>;
}
/**
* StorageUsage is used to count the amount of storage used by a contract.
*/
export type StorageUsage = u64;
/**
* Balance is a type for storing amounts of tokens, specified in yoctoNEAR.
*/
export type Balance = U128;
/**
* Represents the amount of NEAR tokens in "gas units" which are used to fund transactions.
*/
export type Gas = u64;
/**
* base64 string.
*/
export type Base64VecU8 = string;
/**
* Raw type for duration in nanoseconds
*/
export type Duration = u64;
/**
* @minLength 2
* @maxLength 64
* @pattern ^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$
*/
export type AccountId = string;
/**
* String representation of a u128-bit integer
* @pattern ^[0-9]+$
*/
export type U128 = string;
/**
* Public key in a binary format with base58 string serialization with human-readable curve.
* The key types currently supported are `secp256k1` and `ed25519`.
* 
* Ed25519 public keys accepted are 32 bytes and secp256k1 keys are the uncompressed 64 format.
*/
export type PublicKey = string;
/**
* Raw type for timestamp in nanoseconds
*/
export type Timestamp = u64;

export class Contract {
  
  constructor(public account: Account, public readonly contractId: string){}
  
  test_simple(args: {
    array: Uint8Array;
  }, options?: ViewFunctionOptions): Promise<string> {
    return this.account.viewFunction(this.contractId, "test_simple", args, options);
  }
  test_array(args: {
    other: Uint8Array;
    number: u8;
    othernum: i32;
  }, options?: ViewFunctionOptions): Promise<[string, u64]> {
    return this.account.viewFunction(this.contractId, "test_array", args, options);
  }
  test_vec(args: {
    other: Uint8Array;
    number: u8;
    othernum: i32;
  }, options?: ViewFunctionOptions): Promise<[string, u64]> {
    return this.account.viewFunction(this.contractId, "test_vec", args, options);
  }
  test_option(args: {
    other: Uint8Array;
    number: u8;
    othernum: i32;
  }, options?: ViewFunctionOptions): Promise<[string, u64] | null> {
    return this.account.viewFunction(this.contractId, "test_option", args, options);
  }
  test_result(args: {
    other: Uint8Array;
    number: u8;
    othernum: i32;
  }, options?: ViewFunctionOptions): Promise<Result<[string, u64], string>> {
    return this.account.viewFunction(this.contractId, "test_result", args, options);
  }
  test_tuple_fn(args: {
    other: Uint8Array;
    test_struct: TestStruct;
    other_enum: TestEnum;
  }, options?: ViewFunctionOptions): Promise<[string, i64]> {
    return this.account.viewFunction(this.contractId, "test_tuple_fn", args, options);
  }
  use_string_alias(args: {
    s: StringAlias;
  }, options?: ViewFunctionOptions): Promise<StringAlias> {
    return this.account.viewFunction(this.contractId, "use_string_alias", args, options);
  }
  has_mutable(args: {
    s: string;
  }, options?: ViewFunctionOptions): Promise<string> {
    return this.account.viewFunction(this.contractId, "has_mutable", args, options);
  }
}
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
export type Result<T, E> = { tag: "ok", val: T } | { tag: "err", val: E };

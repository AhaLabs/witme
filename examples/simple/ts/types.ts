
/** 
* @minimum 0
* @maximum 18446744073709551615
* @asType integer
*/
export type u64 = number;
/** 
* @minimum -9223372036854775808
* @maximum 9223372036854775807
* @asType integer
*/
export type i64 = number;

/**
* @minimum  0 
* @maximum 255
* @asType integer
* */
export type u8 = number;
/**
* @minimum  -128 
* @maximum 127
* @asType integer
* */
export type i8 = number;
/**
* @minimum  0 
* @maximum 65535
* @asType integer
* */
export type u16 = number;
/**
* @minimum -32768 
* @maximum 32767
* @asType integer
* */
export type i16 = number;
/**
* @minimum 0 
* @maximum 4294967295
* @asType integer
* */
export type u32 = number;
/**
* @minimum 0 
* @maximum 4294967295
* @asType integer
* */
export type usize = number;
/**
* @minimum  -2147483648 
* @maximum 2147483647
* @asType integer
* */
export type i32 = number;

/**
* @minimum -3.40282347E+38
* @maximum 3.40282347E+38
*/
export type f32 = number;

/**
* @minimum -1.7976931348623157E+308
* @maximum 1.7976931348623157E+308
*/
export type f64 = number;

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
export type Result<T, E> = { tag: "ok", val: T } | { tag: "err", val: E };

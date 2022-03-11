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
* @maximum 18446744073709551615
* @asType integer
*/
type u64 = number;
/** 
* @minimum -9223372036854775808
* @maximum 9223372036854775807
* @asType integer
*/
type i64 = number;

/**
* @minimum  0 
* @maximum 255
* @asType integer
* */
type u8 = number;
/**
* @minimum  -128 
* @maximum 127
* @asType integer
* */
type i8 = number;
/**
* @minimum  0 
* @maximum 65535
* @asType integer
* */
type u16 = number;
/**
* @minimum -32768 
* @maximum 32767
* @asType integer
* */
type i16 = number;
/**
* @minimum 0 
* @maximum 4294967295
* @asType integer
* */
type u32 = number;
/**
* @minimum 0 
* @maximum 4294967295
* @asType integer
* */
type usize = number;
/**
* @minimum  -2147483648 
* @maximum 2147483647
* @asType integer
* */
type i32 = number;

/**
* @minimum -3.40282347E+38
* @maximum 3.40282347E+38
*/
type f32 = number;

/**
* @minimum -1.7976931348623157E+308
* @maximum 1.7976931348623157E+308
*/
type f64 = number;
export interface Config {
  option_one: string;
}
export interface ChangeConfig {
  config: Config;
}
export interface VersionedPolicy {
  version: u32;
}
export interface ChangePolicy {
  policy: VersionedPolicy;
}
export type ProposalKind = ProposalKindChangeConfig | ProposalKindChangePolicy;
/**
* Change the DAO config.
*/
export interface ProposalKindChangeConfig {
  tag: "change-config",
  val: ChangeConfig,
}
/**
* Change the full policy.
*/
export interface ProposalKindChangePolicy {
  tag: "change-policy",
  val: ChangePolicy,
}

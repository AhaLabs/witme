import { Account, transactions, providers, DEFAULT_FUNCTION_CALL_GAS } from 'near-api-js';


import BN from 'bn.js';
export interface ChangeMethodOptions {
  gas?: BN;
  attachedDeposit?: BN;
  walletMeta?: string;
  walletCallbackUrl?: string;
}
export interface ViewFunctionOptions {
  // TODO currently JSON schema generator doesn't like function types
  parse?: any;
  // TODO currently JSON schema generator doesn't like function types
  stringify?: any;
}

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
/**
* StorageUsage is used to count the amount of storage used by a contract.
*/
export type StorageUsage = u64;
/**
* Balance is a type for storing amounts of tokens, specified in yoctoNEAR.
*/
export type Balance = U128;
/**
* String representation of a u128-bit integer
* @pattern ^[0-9]+$
* Note: largest u128 is "340282366920938463463374607431768211455"
*/
export type U128 = string;
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
  
  async set_status(args: {
    message: string;
  }, options?: ChangeMethodOptions): Promise<void> {
    return providers.getTransactionLastResult(await this.set_statusRaw(args, options));
  }
  set_statusRaw(args: {
    message: string;
  }, options?: ChangeMethodOptions): Promise<providers.FinalExecutionOutcome> {
    return this.account.functionCall({contractId: this.contractId, methodName: "set_status", args, ...options});
  }
  set_statusTx(args: {
    message: string;
  }, options?: ChangeMethodOptions): transactions.Action {
    return transactions.functionCall("set_status", args, options?.gas ?? DEFAULT_FUNCTION_CALL_GAS, options?.attachedDeposit ?? new BN(0))
  }
  get_status(args: {
    account_id: AccountId;
  }, options?: ViewFunctionOptions): Promise<string | null> {
    return this.account.viewFunction(this.contractId, "get_status", args, options);
  }
}
/**
* 
* @contractMethod change
*/
export interface SetStatus {
  message: string;
}
/**
* 
* @contractMethod view
*/
export interface GetStatus {
  account_id: AccountId;
}

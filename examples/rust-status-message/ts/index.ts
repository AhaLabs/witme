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
  
  /**
  * Retreive a message for a given account id
  */
  get_status(args: {
    account_id: AccountId;
  }, options?: ViewFunctionOptions): Promise<string | null> {
    return this.account.viewFunction(this.contractId, "get_status", args, options);
  }
  /**
  * Store a message for current signer account
  */
  async set_status(args: {
    message: string;
  }, options?: ChangeMethodOptions): Promise<void> {
    return providers.getTransactionLastResult(await this.set_statusRaw(args, options));
  }
  /**
  * Store a message for current signer account
  */
  set_statusRaw(args: {
    message: string;
  }, options?: ChangeMethodOptions): Promise<providers.FinalExecutionOutcome> {
    return this.account.functionCall({contractId: this.contractId, methodName: "set_status", args, ...options});
  }
  /**
  * Store a message for current signer account
  */
  set_statusTx(args: {
    message: string;
  }, options?: ChangeMethodOptions): transactions.Action {
    return transactions.functionCall("set_status", args, options?.gas ?? DEFAULT_FUNCTION_CALL_GAS, options?.attachedDeposit ?? new BN(0))
  }
}
/**
* Retreive a message for a given account id
* 
* @contractMethod view
*/
export interface GetStatus {
  args: {
    account_id: AccountId;
  };
  
}
export type GetStatus__Result = string | null;
/**
* Store a message for current signer account
* 
* @contractMethod change
*/
export interface SetStatus {
  args: {
    message: string;
  };
  options: {
    /** Units in gas
    * @pattern [0-9]+
    * @default "30000000000000"
    */
    gas?: string;
    /** Units in yoctoNear
    * @default 0
    */
    attachedDeposit?: Balance;
  }
  
}
export type SetStatus__Result = void;

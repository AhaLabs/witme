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
* A message that contains some text
*/
export interface Message {
  /**
  * Inner string value
  * @pattern ^TEXT:
  */
  text: string;
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
  
  /**
  * A view call to get the current message
  */
  get_message(args = {}, options?: ViewFunctionOptions): Promise<Message> {
    return this.account.viewFunction(this.contractId, "get_message", args, options);
  }
  /**
  * A change call to set the message
  */
  async set_message(args: {
    message: Message;
  }, options?: ChangeMethodOptions): Promise<void> {
    return providers.getTransactionLastResult(await this.set_messageRaw(args, options));
  }
  /**
  * A change call to set the message
  */
  set_messageRaw(args: {
    message: Message;
  }, options?: ChangeMethodOptions): Promise<providers.FinalExecutionOutcome> {
    return this.account.functionCall({contractId: this.contractId, methodName: "set_message", args, ...options});
  }
  /**
  * A change call to set the message
  */
  set_messageTx(args: {
    message: Message;
  }, options?: ChangeMethodOptions): transactions.Action {
    return transactions.functionCall("set_message", args, options?.gas ?? DEFAULT_FUNCTION_CALL_GAS, options?.attachedDeposit ?? new BN(0))
  }
}
/**
* A view call to get the current message
* 
* @contractMethod view
*/
export interface GetMessage {
  args: {};
  
}
export type GetMessage__Result = Message;
/**
* A change call to set the message
* 
* @contractMethod change
*/
export interface SetMessage {
  args: {
    message: Message;
  };
  options: {
    /** Units in gas
    * @pattern [0-9]+
    * @default "30000000000000"
    */
    gas?: string;
    /** Units in yoctoNear
    * @default "0"
    */
    attachedDeposit?: Balance;
  }
  
}
export type SetMessage__Result = void;

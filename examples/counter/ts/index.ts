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
/**
* In this implementation, the Token struct takes two extensions standards (metadata and approval) as optional fields, as they are frequently used in modern NFTs.
*/
export interface Token {
  token_id: TokenId;
  owner_id: AccountId;
  metadata?: TokenMetadata;
  approved_account_ids?: Record<AccountId, u64>;
}
export interface FungibleTokenMetadata {
  spec: string;
  name: string;
  symbol: string;
  icon?: string;
  reference?: string;
  reference_hash?: Base64VecU8;
  decimals: u8;
}
/**
* Note that token IDs for NFTs are strings on NEAR. It's still fine to use autoincrementing numbers as unique IDs if desired, but they should be stringified. This is to make IDs more future-proof as chain-agnostic conventions and standards arise, and allows for more flexibility with considerations like bridging NFTs across chains, etc.
*/
export type TokenId = string;
/**
* Metadata for the NFT contract itself.
*/
export interface NftContractMetadata {
  spec: string;
  name: string;
  symbol: string;
  icon?: string;
  base_uri?: string;
  reference?: string;
  reference_hash?: Base64VecU8;
}
export interface StorageBalanceBounds {
  min: U128;
  max?: U128;
}
/**
* Metadata on the individual token level.
*/
export interface TokenMetadata {
  title?: string;
  description?: string;
  media?: string;
  media_hash?: Base64VecU8;
  copies?: u64;
  issued_at?: string;
  expires_at?: string;
  starts_at?: string;
  updated_at?: string;
  extra?: string;
  reference?: string;
  reference_hash?: Base64VecU8;
}
export interface StorageBalance {
  total: U128;
  available: U128;
}
export type WrappedDuration = string;

export class Contract {
  
  constructor(public account: Account, public readonly contractId: string){}
  
  /**
  * Returns 8-bit signed integer of the counter value.
  * 
  * This must match the type from our struct's 'val' defined above.
  * 
  * Note, the parameter is `&self` (without being mutable) meaning it doesn't modify state.
  * In the frontend (/src/main.js) this is added to the "viewMethods" array
  * using near-cli we can call this by:
  * 
  * ```bash
  * near view counter.YOU.testnet get_num
  * ```
  */
  get_num(args = {}, options?: ViewFunctionOptions): Promise<i8> {
    return this.account.viewFunction(this.contractId, "get_num", args, options);
  }
  /**
  * Reset to zero.
  */
  async reset(args = {}, options?: ChangeMethodOptions): Promise<void> {
    return providers.getTransactionLastResult(await this.resetRaw(args, options));
  }
  /**
  * Reset to zero.
  */
  resetRaw(args = {}, options?: ChangeMethodOptions): Promise<providers.FinalExecutionOutcome> {
    return this.account.functionCall({contractId: this.contractId, methodName: "reset", args, ...options});
  }
  /**
  * Reset to zero.
  */
  resetTx(args = {}, options?: ChangeMethodOptions): transactions.Action {
    return transactions.functionCall("reset", args, options?.gas ?? DEFAULT_FUNCTION_CALL_GAS, options?.attachedDeposit ?? new BN(0))
  }
  /**
  * Increment the counter.
  * 
  * Note, the parameter is "&mut self" as this function modifies state.
  * In the frontend (/src/main.js) this is added to the "changeMethods" array
  * using near-cli we can call this by:
  * 
  * ```bash
  * near call counter.YOU.testnet increment --accountId donation.YOU.testnet
  * ```
  */
  async increment(args = {}, options?: ChangeMethodOptions): Promise<void> {
    return providers.getTransactionLastResult(await this.incrementRaw(args, options));
  }
  /**
  * Increment the counter.
  * 
  * Note, the parameter is "&mut self" as this function modifies state.
  * In the frontend (/src/main.js) this is added to the "changeMethods" array
  * using near-cli we can call this by:
  * 
  * ```bash
  * near call counter.YOU.testnet increment --accountId donation.YOU.testnet
  * ```
  */
  incrementRaw(args = {}, options?: ChangeMethodOptions): Promise<providers.FinalExecutionOutcome> {
    return this.account.functionCall({contractId: this.contractId, methodName: "increment", args, ...options});
  }
  /**
  * Increment the counter.
  * 
  * Note, the parameter is "&mut self" as this function modifies state.
  * In the frontend (/src/main.js) this is added to the "changeMethods" array
  * using near-cli we can call this by:
  * 
  * ```bash
  * near call counter.YOU.testnet increment --accountId donation.YOU.testnet
  * ```
  */
  incrementTx(args = {}, options?: ChangeMethodOptions): transactions.Action {
    return transactions.functionCall("increment", args, options?.gas ?? DEFAULT_FUNCTION_CALL_GAS, options?.attachedDeposit ?? new BN(0))
  }
  /**
  * Decrement (subtract from) the counter.
  * 
  * ```bash
  * near call counter.YOU.testnet decrement --accountId donation.YOU.testnet
  * ```
  */
  async decrement(args = {}, options?: ChangeMethodOptions): Promise<void> {
    return providers.getTransactionLastResult(await this.decrementRaw(args, options));
  }
  /**
  * Decrement (subtract from) the counter.
  * 
  * ```bash
  * near call counter.YOU.testnet decrement --accountId donation.YOU.testnet
  * ```
  */
  decrementRaw(args = {}, options?: ChangeMethodOptions): Promise<providers.FinalExecutionOutcome> {
    return this.account.functionCall({contractId: this.contractId, methodName: "decrement", args, ...options});
  }
  /**
  * Decrement (subtract from) the counter.
  * 
  * ```bash
  * near call counter.YOU.testnet decrement --accountId donation.YOU.testnet
  * ```
  */
  decrementTx(args = {}, options?: ChangeMethodOptions): transactions.Action {
    return transactions.functionCall("decrement", args, options?.gas ?? DEFAULT_FUNCTION_CALL_GAS, options?.attachedDeposit ?? new BN(0))
  }
}
/**
* Returns 8-bit signed integer of the counter value.
* 
* This must match the type from our struct's 'val' defined above.
* 
* Note, the parameter is `&self` (without being mutable) meaning it doesn't modify state.
* In the frontend (/src/main.js) this is added to the "viewMethods" array
* using near-cli we can call this by:
* 
* ```bash
* near view counter.YOU.testnet get_num
* ```
* 
* @contractMethod view
*/
export interface GetNum {
}
/**
* Reset to zero.
* 
* @contractMethod change
*/
export interface Reset {
  args: {
    
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
/**
* Increment the counter.
* 
* Note, the parameter is "&mut self" as this function modifies state.
* In the frontend (/src/main.js) this is added to the "changeMethods" array
* using near-cli we can call this by:
* 
* ```bash
* near call counter.YOU.testnet increment --accountId donation.YOU.testnet
* ```
* 
* @contractMethod change
*/
export interface Increment {
  args: {
    
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
/**
* Decrement (subtract from) the counter.
* 
* ```bash
* near call counter.YOU.testnet decrement --accountId donation.YOU.testnet
* ```
* 
* @contractMethod change
*/
export interface Decrement {
  args: {
    
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

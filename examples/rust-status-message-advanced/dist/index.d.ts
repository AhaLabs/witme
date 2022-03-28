import { Account, transactions, providers, u64, ChangeMethodOptions, ViewFunctionOptions } from './helper'; /**
* StorageUsage is used to count the amount of storage used by a contract.
*/
export declare type StorageUsage = u64;
/**
* Balance is a type for storing amounts of tokens, specified in yoctoNEAR.
*/
export declare type Balance = U128;
/**
* String representation of a u128-bit integer
* @pattern ^[0-9]+$
* Note: largest u128 is "340282366920938463463374607431768211455"
*/
export declare type U128 = string;
/**
* Represents the amount of NEAR tokens in "gas units" which are used to fund transactions.
*/
export declare type Gas = u64;
/**
* base64 string.
*/
export declare type Base64VecU8 = string;
/**
* Raw type for duration in nanoseconds
*/
export declare type Duration = u64;
/**
* @minLength 2
* @maxLength 64
* @pattern ^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$
*/
export declare type AccountId = string;
/**
* Public key in a binary format with base58 string serialization with human-readable curve.
* The key types currently supported are `secp256k1` and `ed25519`.
*
* Ed25519 public keys accepted are 32 bytes and secp256k1 keys are the uncompressed 64 format.
*/
export declare type PublicKey = string;
/**
* Raw type for timestamp in nanoseconds
*/
export declare type Timestamp = u64;
export declare class Contract {
    account: Account;
    readonly contractId: string;
    constructor(account: Account, contractId: string);
    /**
    * Retreive a message for a given account id
    */
    get_status(args: {
        account_id: AccountId;
    }, options?: ViewFunctionOptions): Promise<string | null>;
    /**
    * Store a message for current signer account
    */
    set_status(args: {
        message: string;
    }, options?: ChangeMethodOptions): Promise<void>;
    /**
    * Store a message for current signer account
    */
    set_statusRaw(args: {
        message: string;
    }, options?: ChangeMethodOptions): Promise<providers.FinalExecutionOutcome>;
    /**
    * Store a message for current signer account
    */
    set_statusTx(args: {
        message: string;
    }, options?: ChangeMethodOptions): transactions.Action;
}
/**
* Retreive a message for a given account id
*
* @contractMethod view
*/
export interface GetStatus {
    account_id: AccountId;
}
/**
* Store a message for current signer account
*
* @contractMethod change
*/
export interface SetStatus {
    message: string;
}

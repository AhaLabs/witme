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
  * Decrement (subtract from) the counter.
  * 
  * In (/src/main.js) this is also added to the "changeMethods" array
  * using near-cli we can call this by:
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
  * In (/src/main.js) this is also added to the "changeMethods" array
  * using near-cli we can call this by:
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
  * In (/src/main.js) this is also added to the "changeMethods" array
  * using near-cli we can call this by:
  * 
  * ```bash
  * near call counter.YOU.testnet decrement --accountId donation.YOU.testnet
  * ```
  */
  decrementTx(args = {}, options?: ChangeMethodOptions): transactions.Action {
    return transactions.functionCall("decrement", args, options?.gas ?? DEFAULT_FUNCTION_CALL_GAS, options?.attachedDeposit ?? new BN(0))
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
}
/**
* Decrement (subtract from) the counter.
* 
* In (/src/main.js) this is also added to the "changeMethods" array
* using near-cli we can call this by:
* 
* ```bash
* near call counter.YOU.testnet decrement --accountId donation.YOU.testnet
* ```
* 
* @contractMethod change
*/
export interface Decrement {
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
}

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
}

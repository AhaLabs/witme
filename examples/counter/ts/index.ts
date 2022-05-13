
import {
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
  Gas,
  PublicKey,
  StorageUsage,
  Base64VecU8,
  Balance,
  AccountId,
  Timestamp,
  Duration,
  U128,
} from "./types";

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
  args: {};
  
}
export type GetNum__Result = i8;
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
  args: {};
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
export type Increment__Result = void;
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
  args: {};
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
export type Decrement__Result = void;
/**
* Reset to zero.
* 
* @contractMethod change
*/
export interface Reset {
  args: {};
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
export type Reset__Result = void;

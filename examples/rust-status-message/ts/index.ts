
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
  U128,
  AccountId,
  Base64VecU8,
  StorageUsage,
  Gas,
  Balance,
  Duration,
  Timestamp,
  PublicKey,
  Fun,
} from "./types";

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
    * @default "0"
    */
    attachedDeposit?: Balance;
  }
  
}
export type SetStatus__Result = void;
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
* 
* @contractMethod view
*/
export interface GetFun {
  args: {};
  
}
export type GetFun__Result = Fun;

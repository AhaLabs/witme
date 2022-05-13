
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
  CallOptions,
  Balance,
  Timestamp,
  PublicKey,
  AccountId,
  Duration,
  Gas,
  Fun,
  StorageUsage,
  Base64VecU8,
  U128,
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
  options: CallOptions
  
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

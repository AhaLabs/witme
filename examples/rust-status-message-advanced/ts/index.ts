
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
  U128,
  PublicKey,
  Base64VecU8,
  StorageUsage,
  Message,
  Balance,
  AccountId,
  Gas,
  Duration,
  Timestamp,
} from "./types";

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
  options: CallOptions
  
}
export type SetMessage__Result = void;

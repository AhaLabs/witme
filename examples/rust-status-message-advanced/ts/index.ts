
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
  AccountId,
  StorageUsage,
  Gas,
  Base64VecU8,
  Duration,
  Message,
  Balance,
  Timestamp,
  U128,
  PublicKey,
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

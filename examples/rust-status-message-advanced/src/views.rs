use near_sdk::near_bindgen;
use crate::*;

trait ViewMessage {
  fn get_message(self) -> Message;
}

#[near_bindgen]
impl ViewMessage for Contract {
    /// A view call to get the current message
    fn get_message(self) -> Message {
      self.message
  }

}
pub mod extract;
pub mod inject;
pub mod json;
pub mod ts;
pub mod wit;

pub use extract::*;
pub use inject::*;
pub use json::*;
pub use ts::*;
pub use wit::*;

pub trait Runnable {
    fn run(self) -> anyhow::Result<()>;
}

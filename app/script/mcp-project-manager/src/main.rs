use anyhow::Result;
use dotenv::dotenv;
use tokio::io::{self, AsyncBufReadExt, AsyncWriteExt, BufReader};

mod config;
mod grist;
mod handlers;
mod instructions;
mod models;
mod plan;
mod server;

#[tokio::main]
async fn main() -> Result<()> {
    // .env 파일 로드
    dotenv().ok();

    let stdin = io::stdin();
    let mut stdout = io::stdout();
    let mut reader = BufReader::new(stdin).lines();

    while let Some(line) = reader.next_line().await? {
        if let Some(response) = server::handle_request(&line).await? {
            let json = serde_json::to_string(&response)?;
            stdout.write_all(json.as_bytes()).await?;
            stdout.write_all(b"\n").await?;
            stdout.flush().await?;
        }
    }

    Ok(())
}

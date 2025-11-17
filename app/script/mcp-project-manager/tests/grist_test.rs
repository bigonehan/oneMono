use dotenv::dotenv;
use mcp_project_manager::config::load_type_config;
use mcp_project_manager::grist::{GristClient, LocalGristClient}; // GristClient 추가
use mcp_project_manager::handlers::code::CodeHandler;
use mcp_project_manager::plan::Plan;
use std::env;

#[tokio::test]
async fn test_code_handler() {
    dotenv().ok();

    let base_url = env::var("GRIST_BASE_URL").expect("GRIST_BASE_URL not set");
    let api_key = env::var("GRIST_API_KEY").expect("GRIST_API_KEY not set");
    let doc_id = env::var("GRIST_DOC_ID").expect("GRIST_DOC_ID not set");

    // Grist 클라이언트 생성
    let client = LocalGristClient::new(base_url, api_key, doc_id);

    // code type config 로드
    let config = load_type_config("code").expect("Failed to load code config");

    // CodeHandler 생성
    let handler = CodeHandler::new(&client, config);

    // 테스트용 Plan 생성
    let test_plan = Plan {
        project_type: "code".to_string(),
        name: "테스트 프로젝트".to_string(),
        description: "Rust MCP 테스트".to_string(),
        tech: Some("Rust, Tokio".to_string()),
    };

    // Row 삽입

    match handler.create_project_row(&test_plan).await {
        Ok(response) => {
            println!("✅ Row insert request sent!");
            println!(
                "Insert Response: {}",
                serde_json::to_string_pretty(&response).unwrap()
            );
        }
        Err(e) => {
            println!("❌ Failed to insert row: {}", e);
            panic!("Test failed");
        }
    }
    // 모든 rows 조회
    match handler.get_all_rows("Table7").await {
        Ok(rows) => {
            println!("\n✅ Found rows:");
            println!("{}", serde_json::to_string_pretty(&rows).unwrap());
        }
        Err(e) => {
            println!("❌ Failed to get rows: {}", e);
        }
    }

    match client.find_reference_id("Projects", "A", "음 ").await {
        Ok(Some(id)) => {
            println!("✅ Found project ID: {}", id);
        }
        Ok(None) => {
            println!("❌ Project not found");
        }
        Err(e) => {
            println!("❌ Error: {}", e);
            panic!("Test failed");
        }
    }
}

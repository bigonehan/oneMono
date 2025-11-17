use crate::config::load_type_config;
use crate::grist::LocalGristClient;
use crate::handlers::code::CodeHandler;
use crate::models::{JsonRpcError, JsonRpcRequest, JsonRpcResponse};
use crate::plan::read_plan;
use anyhow::Result;
use serde_json::{json, Value};
use std::env;

pub async fn handle_request(line: &str) -> Result<Option<JsonRpcResponse>> {
    let request: JsonRpcRequest = serde_json::from_str(line)?;

    let response = match request.method.as_str() {
        "initialize" => handle_initialize(&request),
        "tools/list" => handle_tools_list(&request),
        "tools/call" => handle_tools_call(&request).await,
        _ => create_error_response(request.id, -32601, "Method not found"),
    };

    Ok(Some(response))
}

fn handle_initialize(request: &JsonRpcRequest) -> JsonRpcResponse {
    JsonRpcResponse {
        jsonrpc: "2.0".to_string(),
        id: request.id.clone(),
        result: Some(json!({
            "protocolVersion": "2024-11-05",
            "capabilities": {
                "tools": {}
            },
            "serverInfo": {
                "name": "mcp-project-manager",
                "version": "0.1.0"
            }
        })),
        error: None,
    }
}

fn handle_tools_list(request: &JsonRpcRequest) -> JsonRpcResponse {
    JsonRpcResponse {
        jsonrpc: "2.0".to_string(),
        id: request.id.clone(),
        result: Some(json!({
            "tools": [
                {
                    "name": "create_project",
                    "description": "Create a new project in Grist from plan.md",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "folder_path": {
                                "type": "string",
                                "description": "Path to folder containing plan.md"
                            }
                        },
                        "required": ["folder_path"]
                    }
                }
            ]
        })),
        error: None,
    }
}

async fn handle_tools_call(request: &JsonRpcRequest) -> JsonRpcResponse {
    let params = match &request.params {
        Some(p) => p,
        None => return create_error_response(request.id.clone(), -32602, "Missing params"),
    };

    let tool_name = params["name"].as_str().unwrap_or("");
    let arguments = &params["arguments"];

    let result = match tool_name {
        "create_project" => execute_create_project(arguments).await,
        _ => Err(anyhow::anyhow!("Unknown tool: {}", tool_name)),
    };

    match result {
        Ok(content) => JsonRpcResponse {
            jsonrpc: "2.0".to_string(),
            id: request.id.clone(),
            result: Some(json!({
                "content": [{
                    "type": "text",
                    "text": content
                }]
            })),
            error: None,
        },
        Err(e) => create_error_response(request.id.clone(), -32603, &e.to_string()),
    }
}

async fn execute_create_project(arguments: &Value) -> Result<String> {
    let folder_path = arguments["folder_path"]
        .as_str()
        .ok_or_else(|| anyhow::anyhow!("folder_path is required"))?;

    // plan.md 읽기
    let plan = read_plan(folder_path)?;

    // type별 지침 읽기
    let instructions = crate::instructions::read_instructions(&plan.project_type)?;

    // type에 맞는 config 로드
    let config = load_type_config(&plan.project_type)?;

    // Grist 클라이언트 생성
    let base_url = env::var("GRIST_BASE_URL")?;
    let api_key = env::var("GRIST_API_KEY")?;
    let doc_id = env::var("GRIST_DOC_ID")?;
    let grist_client = LocalGristClient::new(base_url, api_key, doc_id);

    // type별 handler 실행
    match plan.project_type.as_str() {
        "code" => {
            let handler = CodeHandler::new(&grist_client, config);
            handler.create_project_row(&plan).await?;

            // 지침과 함께 결과 반환
            Ok(format!(
                "Code project '{}' created successfully\n\n=== Instructions ===\n{}",
                plan.name, instructions
            ))
        }
        _ => Err(anyhow::anyhow!(
            "Unsupported project type: {}",
            plan.project_type
        )),
    }
}

fn create_error_response(id: Option<Value>, code: i32, message: &str) -> JsonRpcResponse {
    JsonRpcResponse {
        jsonrpc: "2.0".to_string(),
        id,
        result: None,
        error: Some(JsonRpcError {
            code,
            message: message.to_string(),
        }),
    }
}

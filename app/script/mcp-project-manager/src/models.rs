use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Serialize, Deserialize)]
pub struct JsonRpcRequest {
    pub jsonrpc: String,
    pub id: Option<Value>,
    pub method: String,
    pub params: Option<Value>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct JsonRpcResponse {
    pub jsonrpc: String,
    pub id: Option<Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub result: Option<Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<JsonRpcError>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct JsonRpcError {
    pub code: i32,
    pub message: String,
}

// 추가
#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum ProjectStatus {
    C,
    T,
    R,
    W,
}

#[derive(Debug, Serialize)]
pub struct CodeProjectRow {
    #[serde(rename = "프로젝트")]
    pub project: String,

    #[serde(rename = "완료")]
    pub completed: bool,

    #[serde(rename = "상태")]
    pub status: ProjectStatus,

    #[serde(rename = "항목")]
    pub item: String,

    #[serde(rename = "설명")]
    pub description: String,
}

use anyhow::Result;
use reqwest::Client;
use serde_json::Value;

#[async_trait::async_trait]
pub trait GristClient {
    async fn get_rows(&self, table_id: &str) -> Result<Vec<Value>>;
    async fn insert_row(&self, table_id: &str, data: Value) -> Result<Value>;
    async fn update_row(&self, table_id: &str, row_id: &str, data: Value) -> Result<Value>;
    async fn delete_row(&self, table_id: &str, row_id: &str) -> Result<()>;
    async fn find_reference_id(
        &self,
        table_id: &str,
        name_column: &str,
        name: &str,
    ) -> Result<Option<i64>>;
}

pub struct LocalGristClient {
    base_url: String,
    api_key: String,
    doc_id: String,
    client: Client,
}

impl LocalGristClient {
    pub fn new(base_url: String, api_key: String, doc_id: String) -> Self {
        Self {
            base_url,
            api_key,
            doc_id,
            client: Client::new(),
        }
    }
}

#[async_trait::async_trait]
impl GristClient for LocalGristClient {
    async fn get_rows(&self, table_id: &str) -> Result<Vec<Value>> {
        let url = format!(
            "{}/api/docs/{}/tables/{}/records",
            self.base_url, self.doc_id, table_id
        );

        let response = self
            .client
            .get(&url)
            .header("Authorization", format!("Bearer {}", self.api_key))
            .send()
            .await?;

        let data: Value = response.json().await?;
        Ok(data["records"].as_array().unwrap_or(&vec![]).clone())
    }

    async fn insert_row(&self, table_id: &str, data: Value) -> Result<Value> {
        let url = format!(
            "{}/api/docs/{}/tables/{}/records",
            self.base_url, self.doc_id, table_id
        );

        let response = self
            .client
            .post(&url)
            .header("Authorization", format!("Bearer {}", self.api_key))
            .json(&serde_json::json!({"records": [{"fields": data}]}))
            .send()
            .await?;

        Ok(response.json().await?)
    }

    async fn update_row(&self, table_id: &str, row_id: &str, data: Value) -> Result<Value> {
        let url = format!(
            "{}/api/docs/{}/tables/{}/records",
            self.base_url, self.doc_id, table_id
        );

        let response = self
            .client
            .patch(&url)
            .header("Authorization", format!("Bearer {}", self.api_key))
            .json(&serde_json::json!({"records": [{"id": row_id, "fields": data}]}))
            .send()
            .await?;

        Ok(response.json().await?)
    }

    async fn delete_row(&self, table_id: &str, row_id: &str) -> Result<()> {
        let url = format!(
            "{}/api/docs/{}/tables/{}/records",
            self.base_url, self.doc_id, table_id
        );

        self.client
            .delete(&url)
            .header("Authorization", format!("Bearer {}", self.api_key))
            .json(&serde_json::json!([row_id]))
            .send()
            .await?;

        Ok(())
    }

    async fn find_reference_id(
        &self,
        table_id: &str,
        name_column: &str,
        name: &str,
    ) -> Result<Option<i64>> {
        let rows = self.get_rows(table_id).await?;

        for row in rows {
            if let Some(fields) = row.get("fields") {
                if let Some(row_name) = fields.get(name_column) {
                    if row_name.as_str() == Some(name) {
                        if let Some(id) = row.get("id").and_then(|v| v.as_i64()) {
                            return Ok(Some(id));
                        }
                    }
                }
            }
        }

        Ok(None)
    }
}

use crate::config::TypeConfig;
use crate::grist::GristClient;
use crate::models::{CodeProjectRow, ProjectStatus};
use crate::plan::Plan;
use anyhow::Result;
use serde_json::json;

pub struct CodeHandler<'a, T: GristClient> {
    grist_client: &'a T,
    config: TypeConfig,
}

impl<'a, T: GristClient> CodeHandler<'a, T> {
    pub fn new(grist_client: &'a T, config: TypeConfig) -> Self {
        Self {
            grist_client,
            config,
        }
    }

    pub async fn create_project_row(&self, plan: &Plan) -> Result<serde_json::Value> {
        let row_data = json!({
            "$B": plan.name,
            "$C": false,
            "$D": "C",
            "$E": plan.project_type,
            "$F": plan.description,
        });

        let response = self
            .grist_client
            .insert_row(&self.config.table_id, row_data)
            .await?;

        Ok(response) // 응답을 반환
    }

    pub async fn get_all_rows(&self) -> Result<serde_json::Value> {
        let rows = self.grist_client.get_rows(&self.config.table_id).await?;

        Ok(serde_json::json!(rows))
    }

    pub async fn update_status(&self, row_id: &str, status: ProjectStatus) -> Result<()> {
        let status_str = match status {
            ProjectStatus::C => "C",
            ProjectStatus::T => "T",
            ProjectStatus::R => "R",
            ProjectStatus::W => "W",
        };

        let row_data = json!({
            "$D": status_str,
        });

        self.grist_client
            .update_row(&self.config.table_id, row_id, row_data)
            .await?;

        Ok(())
    }
}

use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::Path;

#[derive(Debug, Deserialize, Serialize)]
pub struct TypeConfig {
    pub table_id: String, // 추가
    pub table_name: String,
    pub columns: HashMap<String, String>,
}

pub fn load_type_config(project_type: &str) -> Result<TypeConfig> {
    let config_path = Path::new("plan").join(format!("{}.yaml", project_type));
    let content = fs::read_to_string(&config_path)
        .context(format!("Failed to read {}.yaml", project_type))?;

    let config: TypeConfig = serde_yaml::from_str(&content).context("Failed to parse yaml")?;

    Ok(config)
}

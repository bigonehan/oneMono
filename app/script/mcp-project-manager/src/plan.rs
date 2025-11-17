use anyhow::{Context, Result};
use std::fs;
use std::path::Path;

#[derive(Debug)]
pub struct Plan {
    pub project_type: String,
    pub name: String,
    pub description: String,
    pub tech: Option<String>,
}

pub fn read_plan(folder_path: &str) -> Result<Plan> {
    let plan_path = Path::new(folder_path).join("plan.md");
    let content = fs::read_to_string(&plan_path).context("Failed to read plan.md")?;

    parse_plan(&content)
}

fn parse_plan(content: &str) -> Result<Plan> {
    let mut project_type = None;
    let mut name = None;
    let mut description = None;
    let mut tech = None;

    for line in content.lines() {
        let line = line.trim();
        if let Some((key, value)) = line.split_once(':') {
            let key = key.trim();
            let value = value.trim();

            match key {
                "type" => project_type = Some(value.to_string()),
                "name" => name = Some(value.to_string()),
                "description" => description = Some(value.to_string()),
                "tech" => tech = Some(value.to_string()),
                _ => {}
            }
        }
    }

    Ok(Plan {
        project_type: project_type.context("type field is required")?,
        name: name.context("name field is required")?,
        description: description.context("description field is required")?,
        tech,
    })
}

use anyhow::{Context, Result};
use std::fs;
use std::path::Path;

pub fn read_instructions(project_type: &str) -> Result<String> {
    let instruction_path = Path::new("instructions").join(format!("{}.md", project_type));
    let content = fs::read_to_string(&instruction_path).context(format!(
        "Failed to read {}.md instruction file",
        project_type
    ))?;

    Ok(content)
}

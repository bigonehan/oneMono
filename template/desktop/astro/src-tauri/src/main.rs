#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;
use std::path::PathBuf;
use std::process::Command;

#[derive(Serialize)]
struct LoginRunResult {
    ok: bool,
    status: String,
    message: String,
    logs: Vec<String>,
}

fn script_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../scripts/google-login.mjs")
}

fn run_playwright_with(runtime: &str, script: &PathBuf) -> Result<LoginRunResult, String> {
    let output = Command::new(runtime)
        .arg(script)
        .output()
        .map_err(|error| format!("{runtime} 실행 실패: {error}"))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);

    let mut logs: Vec<String> = Vec::new();
    logs.push(format!("runtime={runtime}"));
    logs.extend(stdout.lines().map(ToOwned::to_owned));
    logs.extend(stderr.lines().map(|line| format!("stderr: {line}")));

    if output.status.success() {
        return Ok(LoginRunResult {
            ok: true,
            status: "success".to_owned(),
            message: "Playwright 로그인 시퀀스 실행 완료".to_owned(),
            logs,
        });
    }

    Ok(LoginRunResult {
        ok: false,
        status: "error".to_owned(),
        message: format!("Playwright 실행 실패(exit={})", output.status),
        logs,
    })
}

#[tauri::command]
async fn run_google_login() -> Result<LoginRunResult, String> {
    let script = script_path();
    if !script.exists() {
        return Err(format!("Playwright script not found: {}", script.display()));
    }

    let mut failures: Vec<String> = Vec::new();
    for runtime in ["bun", "node"] {
        match run_playwright_with(runtime, &script) {
            Ok(result) => return Ok(result),
            Err(error) => failures.push(error),
        }
    }

    Err(format!("실행 가능한 런타임을 찾지 못했습니다: {}", failures.join(" | ")))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![run_google_login])
        .plugin(tauri_plugin_sql::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

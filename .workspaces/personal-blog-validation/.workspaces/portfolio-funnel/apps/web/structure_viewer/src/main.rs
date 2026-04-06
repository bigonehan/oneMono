use std::env;
use std::io;
use std::path::{Path, PathBuf};
use std::process::{Command, ExitCode};

fn find_monorepo_root(start: &Path) -> Option<PathBuf> {
    let mut cursor = start.to_path_buf();
    loop {
        let markers = [
            cursor.join("pnpm-workspace.yaml").exists(),
            cursor.join("turbo.json").exists(),
            cursor.join(".git").exists(),
        ];
        if markers.iter().any(|value| *value) {
            return Some(cursor);
        }
        if !cursor.pop() {
            return None;
        }
    }
}

fn find_domain_directory(monorepo_root: &Path) -> Option<PathBuf> {
    let candidates = [
        monorepo_root.join("domains"),
        monorepo_root.join("domain"),
        monorepo_root.join("packages").join("domains"),
        monorepo_root.join("packages").join("domain"),
    ];

    candidates
        .into_iter()
        .find(|candidate| candidate.exists() && candidate.is_dir())
}

fn run() -> io::Result<i32> {
    let args: Vec<String> = env::args().collect();
    if args.iter().any(|arg| arg == "--help" || arg == "-h") {
        println!("structure_viewer_bootstrap");
        println!("  --help, -h    show help");
        println!("  (default)     discover monorepo root/domain and run `pnpm astro dev --host`");
        return Ok(0);
    }

    let cwd = env::current_dir()?;
    let monorepo_root = find_monorepo_root(&cwd).unwrap_or_else(|| cwd.clone());
    let domain_directory = find_domain_directory(&monorepo_root);

    println!("monorepo_root={}", monorepo_root.display());
    println!(
        "domain_directory={}",
        domain_directory
            .as_ref()
            .map(|path| path.display().to_string())
            .unwrap_or_else(|| "not-found".to_string())
    );

    let status = Command::new("pnpm")
        .arg("astro")
        .arg("dev")
        .arg("--host")
        .current_dir(&cwd)
        .status()?;

    Ok(status.code().unwrap_or(1))
}

fn main() -> ExitCode {
    match run() {
        Ok(code) => ExitCode::from(code as u8),
        Err(error) => {
            eprintln!("structure_viewer bootstrap failed: {error}");
            ExitCode::from(1)
        }
    }
}

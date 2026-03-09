use std::fs;
use std::path::Path;

pub fn rendering_runtime_foundations_present(root: &Path) -> bool {
    let files = [
        "src/rendering/runtime/types.ts",
        "src/rendering/runtime/pixiRuntime.ts",
        "src/rendering/runtime/R3FViewport.tsx",
        "src/rendering/runtime/RenderingRuntimeBridge.tsx",
        "src/rendering/runtime/index.ts",
        "package.json",
    ];

    files.iter().all(|entry| root.join(entry).exists())
}

pub fn render_function_lists_inside_the_module_card_ui(root: &Path) -> bool {
    let app_tsx = root.join("src/components/App.tsx");
    let Ok(content) = fs::read_to_string(app_tsx) else {
        return false;
    };

    content.contains("selectedModule.functions.map")
        && content.contains("<ul>")
        && content.contains("selectFunction(")
}

pub fn domain_discovery_structure_exists(root: &Path) -> bool {
    let files = [
        "src/domain/discovery/types.ts",
        "src/domain/discovery/fixture.ts",
        "src/domain/discovery/index.ts",
    ];

    if !files.iter().all(|entry| root.join(entry).exists()) {
        return false;
    }

    let app_tsx = root.join("src/components/App.tsx");
    let Ok(content) = fs::read_to_string(app_tsx) else {
        return false;
    };

    content.contains("projectDomainDiscovery") && content.contains("hydrateDiscovery(")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rendering_runtime_files_exist() {
        let root = Path::new(env!("CARGO_MANIFEST_DIR"));
        assert!(rendering_runtime_foundations_present(root));
    }

    #[test]
    fn package_json_declares_runtime_dependencies() {
        let root = Path::new(env!("CARGO_MANIFEST_DIR"));
        let package_json = fs::read_to_string(root.join("package.json")).expect("package.json");

        for dep in ["pixi.js", "@react-three/fiber", "three", "react"] {
            assert!(
                package_json.contains(dep),
                "missing dependency declaration: {dep}"
            );
        }
    }

    #[test]
    fn module_card_renders_function_lists() {
        let root = Path::new(env!("CARGO_MANIFEST_DIR"));
        assert!(render_function_lists_inside_the_module_card_ui(root));
    }

    #[test]
    fn domain_discovery_structure_is_defined() {
        let root = Path::new(env!("CARGO_MANIFEST_DIR"));
        assert!(domain_discovery_structure_exists(root));
    }
}

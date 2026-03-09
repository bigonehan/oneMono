import type { DiscoveredDomain } from "./types";

export const projectDomainDiscovery: DiscoveredDomain[] = [
  {
    id: "app",
    name: "App",
    modules: [
      {
        id: "components",
        name: "components",
        functions: [
          { id: "app_render", name: "App" },
        ],
      },
      {
        id: "state",
        name: "state",
        functions: [
          { id: "hydrate_discovery", name: "hydrateDiscovery" },
          { id: "select_domain", name: "selectDomain" },
          { id: "select_module", name: "selectModule" },
          { id: "select_function", name: "selectFunction" },
        ],
      },
      {
        id: "rendering_runtime",
        name: "rendering/runtime",
        functions: [
          { id: "create_pixi_runtime", name: "createPixiRuntime" },
          { id: "rendering_runtime_bridge", name: "RenderingRuntimeBridge" },
          { id: "r3f_viewport", name: "R3FViewport" },
        ],
      },
    ],
  },
];

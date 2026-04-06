import { promises as fs } from "node:fs";
import path from "node:path";
import { projectDomainDiscovery } from "./fixture";
import type { DiscoveredDomain, DiscoveredFunction, DiscoveredModule } from "./types";

const DOMAIN_CANDIDATES = [
  "domains",
  "domain",
  path.join("packages", "domains"),
  path.join("packages", "domain"),
];

const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const FUNCTION_PATTERNS = [
  /(?:export\s+)?function\s+([A-Za-z0-9_]+)/g,
  /(?:export\s+)?const\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?\(/g,
];

type FunctionAction =
  | "search"
  | "browse"
  | "refresh"
  | "edit"
  | "delete"
  | "save"
  | "confirm"
  | "cancel"
  | "calc";

type DiscoveryMeta = {
  monorepoRoot: string;
  domainDirectory: string | null;
  shadcnAvailable: boolean;
};

export type ProjectDiscoveryResult = {
  meta: DiscoveryMeta;
  domains: DiscoveredDomain[];
};

const ACTION_ICON_MAP: Record<FunctionAction, string> = {
  search: "🔍",
  browse: "📁",
  refresh: "🔄",
  edit: "✏",
  delete: "🗑",
  save: "📄↑",
  confirm: "✔",
  cancel: "✕",
  calc: "🧮",
};

const LLM_FUNCTION_ICON_MAPPER: Record<FunctionAction, string[]> = {
  search: ["search", "query", "find", "filter", "match", "lookup"],
  browse: ["folder", "directory", "tree", "browse", "explore", "discover", "load", "read", "list", "get", "fetch"],
  refresh: ["refresh", "reload", "revalidate", "hydrate", "rescan"],
  edit: ["update", "set", "edit", "patch", "change", "rename", "modify", "convert", "transform", "map", "parse", "format"],
  delete: ["delete", "remove", "clear", "drop", "destroy"],
  save: ["save", "store", "persist", "write", "export", "upload", "sync"],
  confirm: ["confirm", "approve", "accept", "check", "verify"],
  cancel: ["cancel", "close", "abort", "reset", "dismiss"],
  calc: ["calc", "count", "sum", "total", "compute", "estimate"],
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const fileExists = async (target: string): Promise<boolean> => {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
};

const isDirectory = async (target: string): Promise<boolean> => {
  try {
    const stats = await fs.stat(target);
    return stats.isDirectory();
  } catch {
    return false;
  }
};

const hasWorkspaceManifest = async (target: string): Promise<boolean> => {
  const packageJsonPath = path.join(target, "package.json");
  if (!(await fileExists(packageJsonPath))) {
    return false;
  }
  try {
    const json = JSON.parse(await fs.readFile(packageJsonPath, "utf8")) as {
      workspaces?: unknown;
    };
    return Boolean(json.workspaces);
  } catch {
    return false;
  }
};

const inferFunctionAction = (functionName: string): FunctionAction => {
  const lowerName = functionName.toLowerCase();

  for (const action of Object.keys(LLM_FUNCTION_ICON_MAPPER) as FunctionAction[]) {
    if (LLM_FUNCTION_ICON_MAPPER[action].some((keyword) => lowerName.includes(keyword))) {
      return action;
    }
  }

  return "calc";
};

const defaultDescription = (functionName: string, action: FunctionAction, domainName: string): string =>
  `Auto-generated: ${functionName} handles ${action} behavior in ${domainName}.`;

type FunctionCatalogItem = {
  name: string;
  iconKey: FunctionAction;
  description: string;
};

const parseFunctionYaml = (content: string): Map<string, FunctionCatalogItem> => {
  const table = new Map<string, FunctionCatalogItem>();
  const lines = content.split(/\r?\n/);
  let current: FunctionCatalogItem | null = null;

  const flush = () => {
    if (!current) {
      return;
    }
    table.set(current.name, current);
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("- name:")) {
      flush();
      current = {
        name: line.replace("- name:", "").trim().replace(/^"|"$/g, ""),
        iconKey: "calc",
        description: "",
      };
      continue;
    }
    if (!current) {
      continue;
    }
    if (line.startsWith("icon:")) {
      const iconKey = line.replace("icon:", "").trim().replace(/^"|"$/g, "");
      if ((Object.keys(ACTION_ICON_MAP) as string[]).includes(iconKey)) {
        current.iconKey = iconKey as FunctionAction;
      }
      continue;
    }
    if (line.startsWith("description:")) {
      current.description = line.replace("description:", "").trim().replace(/^"|"$/g, "");
    }
  }

  flush();
  return table;
};

const toYamlSafe = (value: string): string => value.replace(/"/g, '\\"');

const serializeFunctionYaml = (items: FunctionCatalogItem[]): string => {
  const body = items
    .map(
      (item) =>
        `  - name: "${toYamlSafe(item.name)}"\n    icon: "${item.iconKey}"\n    description: "${toYamlSafe(item.description)}"`,
    )
    .join("\n");

  return `functions:\n${body}\n`;
};

const syncFunctionCatalog = async (
  domainPath: string,
  domainName: string,
  functionNames: string[],
): Promise<Map<string, { iconKey: FunctionAction; iconGlyph: string; description: string }>> => {
  const projectDir = path.join(domainPath, ".project");
  const catalogFile = path.join(projectDir, "function.yaml");
  await fs.mkdir(projectDir, { recursive: true });

  const existing = (await fileExists(catalogFile))
    ? parseFunctionYaml(await fs.readFile(catalogFile, "utf8"))
    : new Map<string, FunctionCatalogItem>();

  const mergedItems: FunctionCatalogItem[] = [];
  const sortedNames = [...new Set(functionNames)].sort((a, b) => a.localeCompare(b));

  for (const functionName of sortedNames) {
    const action = inferFunctionAction(functionName);
    const existingItem = existing.get(functionName);
    const iconKey = existingItem?.iconKey ?? action;
    const description =
      existingItem?.description && existingItem.description.length > 0
        ? existingItem.description
        : defaultDescription(functionName, iconKey, domainName);

    mergedItems.push({
      name: functionName,
      iconKey,
      description,
    });
  }

  await fs.writeFile(catalogFile, serializeFunctionYaml(mergedItems), "utf8");

  return new Map(
    mergedItems.map((item) => [
      item.name,
      {
        iconKey: item.iconKey,
        iconGlyph: ACTION_ICON_MAP[item.iconKey],
        description: item.description,
      },
    ]),
  );
};

export const findMonorepoRoot = async (startDir: string): Promise<string> => {
  let cursor = path.resolve(startDir);

  while (true) {
    const markers = await Promise.all([
      fileExists(path.join(cursor, "pnpm-workspace.yaml")),
      fileExists(path.join(cursor, "turbo.json")),
      isDirectory(path.join(cursor, ".git")),
      hasWorkspaceManifest(cursor),
    ]);

    if (markers.some(Boolean)) {
      return cursor;
    }

    const parent = path.dirname(cursor);
    if (parent === cursor) {
      return path.resolve(startDir);
    }
    cursor = parent;
  }
};

const findDomainDirectory = async (monorepoRoot: string): Promise<string | null> => {
  for (const candidate of DOMAIN_CANDIDATES) {
    const resolved = path.join(monorepoRoot, candidate);
    if (await isDirectory(resolved)) {
      return resolved;
    }
  }
  return null;
};

const extractFunctions = (source: string): DiscoveredFunction[] => {
  const names = new Set<string>();
  for (const pattern of FUNCTION_PATTERNS) {
    for (const match of source.matchAll(pattern)) {
      if (match[1]) {
        names.add(match[1]);
      }
    }
  }

  return [...names].map((name) => ({ id: slugify(name), name }));
};

const collectSourceFiles = async (root: string): Promise<string[]> => {
  const queue = [root];
  const files: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      continue;
    }

    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") {
        continue;
      }
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(fullPath);
        continue;
      }
      if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }
  }

  return files;
};

const buildModules = async (domainPath: string, domainName: string): Promise<DiscoveredModule[]> => {
  const sourceFiles = await collectSourceFiles(domainPath);
  const modules = new Map<string, DiscoveredFunction[]>();

  for (const sourceFile of sourceFiles) {
    const content = await fs.readFile(sourceFile, "utf8");
    const functions = extractFunctions(content);
    if (functions.length === 0) {
      continue;
    }
    const relativeDir = path.dirname(path.relative(domainPath, sourceFile));
    const moduleName = relativeDir === "." ? "root" : relativeDir.replaceAll(path.sep, "/");
    const existing = modules.get(moduleName) ?? [];
    const scopedFunctions = functions.map((fn) => ({
      ...fn,
      id: slugify(`${domainName}_${moduleName}_${fn.name}`),
    }));
    modules.set(moduleName, [...existing, ...scopedFunctions]);
  }

  const functionNames = [...modules.values()].flatMap((items) => items.map((item) => item.name));
  const catalog = await syncFunctionCatalog(domainPath, domainName, functionNames);

  return [...modules.entries()].map(([name, functions]) => ({
    id: slugify(name),
    name,
    functions: functions.map((fn) => {
      const meta = catalog.get(fn.name);
      return {
        ...fn,
        iconKey: meta?.iconKey,
        iconGlyph: meta?.iconGlyph,
        description: meta?.description,
      };
    }),
  }));
};

const discoverDomainsFromDirectory = async (domainDirectory: string): Promise<DiscoveredDomain[]> => {
  const entries = await fs.readdir(domainDirectory, { withFileTypes: true });
  const domains: DiscoveredDomain[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const domainPath = path.join(domainDirectory, entry.name);
    const modules = await buildModules(domainPath, entry.name);
    if (modules.length === 0) {
      continue;
    }
    domains.push({
      id: slugify(entry.name),
      name: entry.name,
      modules,
    });
  }

  return domains;
};

const detectShadcn = async (monorepoRoot: string): Promise<boolean> => {
  const packageCandidates = [
    path.join(monorepoRoot, "packages", "ui", "shadcn"),
    path.join(monorepoRoot, "packages", "@ui", "shadcn"),
  ];

  for (const candidate of packageCandidates) {
    if (await isDirectory(candidate)) {
      return true;
    }
  }

  return false;
};

export const discoverProjectDomains = async (
  startDir: string = process.cwd(),
): Promise<ProjectDiscoveryResult> => {
  const monorepoRoot = await findMonorepoRoot(startDir);
  const domainDirectory = await findDomainDirectory(monorepoRoot);
  const shadcnAvailable = await detectShadcn(monorepoRoot);

  const domains = domainDirectory
    ? await discoverDomainsFromDirectory(domainDirectory)
    : projectDomainDiscovery;

  return {
    meta: {
      monorepoRoot,
      domainDirectory,
      shadcnAvailable,
    },
    domains: domains.length > 0 ? domains : projectDomainDiscovery,
  };
};

export * from "./fixture";
export * from "./types";

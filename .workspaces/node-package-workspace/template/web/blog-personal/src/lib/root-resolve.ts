import path from "node:path";
import { fileURLToPath } from "node:url";

const workspace_root_dir = fileURLToPath(new URL("../../", import.meta.url));

export const get_workspace_root = (): string => path.resolve(workspace_root_dir);

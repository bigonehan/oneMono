import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { get_workspace_root } from "../src/lib/root-resolve";

test("get_workspace_root returns the blog-personal app root instead of process cwd", () => {
  const originalCwd = process.cwd();
  const expectedRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

  process.chdir("/");

  try {
    assert.equal(get_workspace_root(), expectedRoot);
  } finally {
    process.chdir(originalCwd);
  }
});

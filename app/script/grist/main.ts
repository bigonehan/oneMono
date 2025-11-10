import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import {
  getAllRows,
  getRowById,
  initGristConfig,
  insertRow,
  updateRow,
} from "./infra/relay";
import { matchesProject, parseArgs, parseBoolean } from "@script/cli";

dotenv.config({ override: true });

interface CliState {
  tableId: string;
  projectId: string;
  currentId?: number;
}

const STATE_PATH = path.resolve(process.cwd(), ".grist-cli.json");

function printUsage() {
  console.log(`Usage:
  bun main.ts init <tableId> <projectId>        Initialize CLI context
  bun main.ts read [--limit <n>]               Read rows for the project
  bun main.ts list                             List every row for the current project
  bun main.ts insert --item <text> --description <text> [--status <code>] [--done <true|false>]
  bun main.ts update --id <rowId> [--item <text>] [--description <text>] [--status <code>] [--done <true|false>]
  bun main.ts current [show|set <value>|sync]  Manage cached next id`);
}

function writeState(state: CliState, options: { quiet?: boolean } = {}) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
  if (!options.quiet) {
    console.log(`✅ CLI context saved to ${STATE_PATH}`);
  }
}

function loadState(): CliState {
  if (!fs.existsSync(STATE_PATH)) {
    throw new Error("CLI context not found. Run `bun main.ts init <tableId> <projectId>` first.");
  }

  const data = JSON.parse(fs.readFileSync(STATE_PATH, "utf-8"));
  if (!data.tableId || !data.projectId) {
    throw new Error("CLI context file is invalid. Re-run init.");
  }
  return data;
}

function configureEnvForState(state: CliState) {
  process.env.GRIST_TABLE = state.tableId;
  initGristConfig();
}

async function syncCurrentId(state: CliState, options: { silent?: boolean } = {}) {
  configureEnvForState(state);
  const rows = await getAllRows();
  const filtered = rows.filter((row) => matchesProject(row.project, state.projectId));
  const maxId = filtered.reduce((acc, row) => {
    const num = Number(row.id);
    return Number.isFinite(num) && num > acc ? num : acc;
  }, 0);
  state.currentId = maxId + 1;
  writeState(state, { quiet: true });
  if (!options.silent) {
    console.log(`🔄 currentId synced. Next id will be ${state.currentId}`);
  }
  return state.currentId;
}

async function handleRead(limitArg?: string) {
  const state = loadState();
  configureEnvForState(state);

  const rows = await getAllRows();
  const filtered = rows.filter((row) => matchesProject(row.project, state.projectId));
  const limit = limitArg ? Number(limitArg) : undefined;
  const output = limit ? filtered.slice(0, limit) : filtered;
  console.table(output);
  if (!output.length) {
    console.log(`⚠️ No rows found for project "${state.projectId}".`);
  }
}

async function handleList() {
  await handleRead(undefined);
}

async function handleInsert(flags: Record<string, string | boolean>) {
  const state = loadState();
  configureEnvForState(state);

  if (typeof state.currentId === "undefined") {
    await syncCurrentId(state, { silent: true });
  }

  const item = flags.item ? String(flags.item) : undefined;
  const description = flags.description ? String(flags.description) : undefined;
  const status = flags.status ? String(flags.status) : undefined;
  const done = parseBoolean(flags.done);

  if (!item || !description) {
    throw new Error("insert command requires --item and --description.");
  }

  const inserted = await insertRow({
    project: state.projectId,
    item,
    description,
    status,
    done,
  });

  console.log("✅ Inserted row:", inserted);

  const insertedId = inserted?.id ? Number(inserted.id) : NaN;
  if (Number.isFinite(insertedId)) {
    state.currentId = insertedId + 1;
    writeState(state, { quiet: true });
    console.log(`📌 currentId updated to ${state.currentId} (next expected id)`);
  }
}

async function handleUpdate(flags: Record<string, string | boolean>) {
  const state = loadState();
  configureEnvForState(state);

  const id = flags.id ? Number(flags.id) : NaN;
  if (!Number.isFinite(id)) {
    throw new Error("update command requires --id <rowId>.");
  }

  const item = flags.item ? String(flags.item) : undefined;
  const description = flags.description ? String(flags.description) : undefined;
  const status = flags.status ? String(flags.status) : undefined;
  const done = parseBoolean(flags.done);

  if (
    typeof item === "undefined" &&
    typeof description === "undefined" &&
    typeof status === "undefined" &&
    typeof done === "undefined"
  ) {
    throw new Error("update command requires at least one field to modify.");
  }

  const updated = await updateRow(id, {
    item,
    description,
    status,
    done,
  });

  const refreshed = await getRowById(id);
  console.log("✅ Update request sent:", updated);
  console.log("📦 Current row snapshot:", refreshed);
}

async function handleInit(args: string[]) {
  const tableId = args[0];
  const projectId = args[1];

  if (!tableId || !projectId) {
    printUsage();
    throw new Error("init command requires <tableId> and <projectId>.");
  }

  const state: CliState = { tableId, projectId };
  writeState(state);

  try {
    await syncCurrentId(state);
  } catch (err) {
    console.warn("⚠️ Unable to sync currentId during init:", err);
  }
}

async function handleCurrent(positional: string[]) {
  const state = loadState();
  const action = positional[0];

  switch (action) {
    case "set": {
      const value = positional[1];
      const num = value ? Number(value) : NaN;
      if (!Number.isFinite(num)) {
        throw new Error("current set requires a numeric value.");
      }
      state.currentId = num;
      writeState(state);
      console.log(`📝 currentId manually set to ${state.currentId}`);
      break;
    }
    case "sync": {
      await syncCurrentId(state);
      break;
    }
    case undefined:
    case "show": {
      if (typeof state.currentId === "undefined") {
        console.log("ℹ️ currentId not set. Run `bun main.ts current sync`.");
      } else {
        console.log(`📍 currentId: ${state.currentId} (next expected id)`);
      }
      break;
    }
    default:
      throw new Error(`Unknown current action "${action}". Use show|set|sync.`);
  }
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const { positional, flags } = parseArgs(rest);

  try {
    switch (command) {
      case "init":
        await handleInit(positional);
        break;
      case "read":
        await handleRead(flags.limit ? String(flags.limit) : undefined);
        break;
      case "list":
        await handleList();
        break;
      case "insert":
        await handleInsert(flags);
        break;
      case "update":
        await handleUpdate(flags);
        break;
      case "current":
        await handleCurrent(positional);
        break;
      default:
        printUsage();
        if (!command) {
          throw new Error("No command specified.");
        } else {
          throw new Error(`Unknown command "${command}".`);
        }
    }
  } catch (err) {
    console.error("❌ CLI error:", err);
    process.exitCode = 1;
  }
}

main();

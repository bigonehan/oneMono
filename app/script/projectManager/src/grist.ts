import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import {
  getAllRows,
  getRowById,
  initGristConfig,
  insertRow,
  updateRow,
} from "../infra/relay";
import { matchesProject, parseArgs, parseBoolean } from "@script/cli";
import { formatAvailableTables } from "./utils";

dotenv.config({ override: true, quiet: true });

export interface CliState {
  tableId: string;
  projectId: string;
  currentId?: number;
}

export const STATE_PATH = path.resolve(process.cwd(), ".grist-cli.json");

function printUsage() {
  console.log(`Usage:
  bun src/grist.ts init <tableId> <projectId>        Initialize CLI context
  bun src/grist.ts read [--limit <n>]               Read rows for the project
  bun src/grist.ts list                             List every row for the current project
  bun src/grist.ts rows <tableId|number> [--limit]  List rows from a specific table
  bun src/grist.ts tables                           List available tables in the configured doc
  bun src/grist.ts insert --item <text> --description <text> [--status <code>] [--done <true|false>]
  bun src/grist.ts update --id <rowId> [--item <text>] [--description <text>] [--status <code>] [--done <true|false>]
  bun src/grist.ts current [show|set <value>|sync]  Manage cached next id`);
}

export function writeState(state: CliState, options: { quiet?: boolean } = {}) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
  if (!options.quiet) {
    console.log(`✅ CLI context saved to ${STATE_PATH}`);
  }
}

export function loadState(): CliState {
  if (!fs.existsSync(STATE_PATH)) {
    throw new Error("CLI context not found. Run `bun src/grist.ts init <tableId> <projectId>` first.");
  }

  const data = JSON.parse(fs.readFileSync(STATE_PATH, "utf-8"));
  if (!data.tableId || !data.projectId) {
    throw new Error("CLI context file is invalid. Re-run init.");
  }
  return data;
}

export function configureEnvForState(state: CliState) {
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

function normalizeTableIdentifier(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("rows command requires a table identifier (e.g., Table7 or 7).");
  }
  if (/^table\d+$/i.test(trimmed)) {
    return trimmed.replace(/^table/i, "Table");
  }
  if (/^\d+$/.test(trimmed)) {
    return `Table${trimmed}`;
  }
  return trimmed;
}

async function handleRows(positional: string[], flags: Record<string, string | boolean>) {
  const target = positional[0];
  if (!target) {
    throw new Error("rows command requires <tableId|number> as the first argument.");
  }

  const tableId = normalizeTableIdentifier(target);
  const config = initGristConfig();
  const headers: Record<string, string> = {};
  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }

  const limit = flags.limit ? Number(flags.limit) : undefined;
  if (typeof limit !== "undefined" && (!Number.isFinite(limit) || limit <= 0)) {
    throw new Error("rows command expects --limit <positive number>.");
  }

  const searchParams = new URLSearchParams();
  if (typeof limit === "number") {
    searchParams.set("limit", String(limit));
  }

  const query = searchParams.toString();
  const url = `${config.baseUrl}/api/docs/${config.docId}/tables/${tableId}/records${query ? `?${query}` : ""}`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch rows for ${tableId}: ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`
    );
  }

  const json = await res.json();
  const records: Array<Record<string, any>> = json.records ?? json ?? [];
  if (!records.length) {
    console.log(`ℹ️ No rows found in ${tableId}.`);
    return;
  }

  const formatted = records.map((record) => ({
    id: record.id ?? record.recordId ?? record.fields?.id ?? "",
    ...(record.fields ?? record),
  }));

  console.log(`📄 Rows from ${tableId}${limit ? ` (limit ${limit})` : ""}:`);
  console.table(formatted);
}

async function fetchTableLabel(
  resolvedId: string,
  config: ReturnType<typeof initGristConfig>,
  headers: Record<string, string>
): Promise<string | null> {
  try {
    const res = await fetch(
      `${config.baseUrl}/api/docs/${config.docId}/tables/${resolvedId}`,
      { headers }
    );
    if (!res.ok) {
      return null;
    }
    const detail = await res.json();
    const label =
      detail.name ??
      detail.label ??
      detail.title ??
      detail.fields?.label ??
      detail.fields?.title ??
      detail.fields?.tableName ??
      detail.fields?.name ??
      null;
    if (label) {
      return label;
    }
    const columnsRes = await fetch(
      `${config.baseUrl}/api/docs/${config.docId}/tables/${resolvedId}/columns`,
      { headers }
    );
    if (!columnsRes.ok) {
      return null;
    }
    const columnsJson = await columnsRes.json();
    return (
      columnsJson.tableLabel ??
      columnsJson.tableName ??
      columnsJson.name ??
      columnsJson.label ??
      null
    );
  } catch {
    return null;
  }
}

async function handleTables() {
  const config = initGristConfig();
  const headers: Record<string, string> = {};
  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }

  const res = await fetch(`${config.baseUrl}/api/docs/${config.docId}/tables`, {
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch tables: ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`
    );
  }

  const json = await res.json();
  const tables: Array<Record<string, any>> = json.tables ?? json ?? [];
  if (!tables.length) {
    console.log("⚠️ No tables found in the current Grist document.");
    return;
  }

  console.log(`📋 Tables in doc "${config.docId}":\n`);
  
  // 테이블 정보를 테이블 형식으로 출력
  const tableData = [];
  
  for (const table of tables) {
    const resolvedId =
      table.id ??
      (typeof table.tableRef === "number" ? `Table${table.tableRef}` : null) ??
      table.fields?.tableRef ??
      "unknown";
    
    const existingLabel =
      table.name ??
      table.label ??
      table.title ??
      table.fields?.label ??
      table.fields?.title ??
      table.fields?.tableName ??
      table.fields?.name ??
      "";
    
    const label =
      existingLabel ||
      (typeof resolvedId === "string"
        ? await fetchTableLabel(resolvedId, config, headers)
        : null) ||
      "";
    
    const tableRef =
      typeof table.tableRef === "number"
        ? table.tableRef
        : table.fields?.tableRef ?? table.fields?.tableRefName;
    
    tableData.push({
      "ID": resolvedId,
      "이름": label || "(없음)",
      "Ref": typeof tableRef !== "undefined" ? tableRef : "-"
    });
  }

  console.table(tableData);
  console.log(`\n💡 Available identifiers: ${formatAvailableTables(tables)}`);
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
        console.log("ℹ️ currentId not set. Run `bun src/grist.ts current sync`.");
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
      case "rows":
        await handleRows(positional, flags);
        break;
      case "tables":
        await handleTables();
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

if (import.meta.main) {
  main();
}

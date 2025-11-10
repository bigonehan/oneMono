import { Either, pipe } from "effect";
import { Environment, Network, RecordSource, Store } from "relay-runtime";
import { formatAvailableTables } from "../utils";

// -----------------------------------------------------------
// 1️⃣ Grist 전역 설정 관리
// -----------------------------------------------------------
interface GristConfig {
  baseUrl: string;
  docId: string;
  table: string;
  apiKey: string;
}

let GRIST_CONFIG: GristConfig | null = null;
interface GristColumnFields {
  label?: string;
  colRef?: number;
  id?: string;
}

interface GristColumnInfo {
  id?: string;
  label?: string;
  fields?: GristColumnFields;
}

interface GristTableInfo {
  id: string;
  name?: string;
  columns?: GristColumnInfo[];
}

export class TableMappingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TableMappingError";
  }
}

let TABLE_INFO: GristTableInfo | null = null;
let COLUMN_MAP_CACHE: Record<string, string> | null = null;
type ColumnKey =
  | "project"
  | "item"
  | "description"
  | "done"
  | "status"
  | "date"
  | "completedAt";

const COLUMN_LABELS: Record<ColumnKey, string> = {
  project: "프로젝트",
  item: "항목",
  description: "설명",
  done: "완료",
  status: "상태",
  date: "날짜",
  completedAt: "완료일",
};

type ColumnInput = Partial<Record<ColumnKey, unknown>>;
export interface GristRow {
  id: string;
  project?: string;
  item?: string;
  description?: string;
  done?: boolean;
  status?: string;
  date?: string;
  completedAt?: string;
}

export function initGristConfig() {
  if (GRIST_CONFIG) return GRIST_CONFIG;

  GRIST_CONFIG = {
    baseUrl: process.env.GRIST_BASE_URL ?? "http://localhost:8484",
    docId: process.env.GRIST_DOC_ID ?? "YOUR_DOC_ID",
    table: process.env.GRIST_TABLE ?? "YOUR_TABLE_ID",
    apiKey: process.env.GRIST_API_KEY ?? "",
  };

  console.log("✅ Grist config initialized:", GRIST_CONFIG);
  return GRIST_CONFIG;
}

function getConfig(): GristConfig {
  if (!GRIST_CONFIG) {
    throw new Error("❌ Grist config not initialized. Call initGristConfig() first.");
  }
  return GRIST_CONFIG;
}

// -----------------------------------------------------------
// 2️⃣ 컬럼 라벨 ↔ 내부 ID 매핑 자동 생성
// -----------------------------------------------------------
async function loadTableInfo(): Promise<GristTableInfo> {
  if (TABLE_INFO) return TABLE_INFO;

  const { baseUrl, docId, table, apiKey } = getConfig();
  const headers = { Authorization: `Bearer ${apiKey}` };

  const tryExact = await fetch(`${baseUrl}/api/docs/${docId}/tables/${table}`, {
    headers,
  });

  if (tryExact.ok) {
    const json = await tryExact.json();
    TABLE_INFO = { id: json.id ?? table, ...json };
    return TABLE_INFO;
  }

  if (tryExact.status !== 404) {
    const text = await tryExact.text().catch(() => "");
    throw new Error(
      `Failed to load table "${table}": ${tryExact.status} ${tryExact.statusText} ${text}`
    );
  }

  const listRes = await fetch(`${baseUrl}/api/docs/${docId}/tables`, { headers });
  if (!listRes.ok) {
    const text = await listRes.text().catch(() => "");
    throw new TableMappingError(
      `Failed to list tables: ${listRes.status} ${listRes.statusText} ${text}`
    );
  }

  const listJson = await listRes.json();
  const tables: Array<Record<string, any>> = listJson.tables ?? listJson ?? [];
  const selectedIdResult = pipe(
    Either.fromNullable(
      tables.find(
        (t) =>
          t.id === table ||
          t.name === table ||
          String(t.tableRef) === table ||
          String(t.fields?.tableRef) === table
      ),
      () =>
        new TableMappingError(
          `Table "${table}" not found in doc ${docId}. Available tables: ${formatAvailableTables(
            tables
          )}`
        )
    ),
    Either.flatMap((matchTable) => {
      const selectedId =
        matchTable.id ??
        (typeof matchTable.tableRef === "number"
          ? `Table${matchTable.tableRef}`
          : null);
      return selectedId
        ? Either.right(selectedId)
        : Either.left(new TableMappingError(`Table "${table}" is missing an id field in Grist response.`));
    })
  );

  if (Either.isLeft(selectedIdResult)) {
    throw selectedIdResult.left;
  }

  const selectedId = selectedIdResult.right;

  const resolvedRes = await fetch(`${baseUrl}/api/docs/${docId}/tables/${selectedId}/columns`, {
    headers,
  });

  if (!resolvedRes.ok) {
    const text = await resolvedRes.text().catch(() => "");
    throw new Error(
      `Failed to load columns for table "${selectedId}": ${resolvedRes.status} ${resolvedRes.statusText} ${text}`
    );
  }

  const columns = await resolvedRes.json();
  TABLE_INFO = {
    id: selectedId,
    columns: columns.columns ?? columns,
  };
  console.log(`🔁 Resolved table "${table}" to id "${TABLE_INFO.id}"`);
  return TABLE_INFO;
}

async function getColumnMap() {
  if (COLUMN_MAP_CACHE) return COLUMN_MAP_CACHE;
  const tableInfo = await loadTableInfo();
  const map: Record<string, string> = {};
  for (const col of tableInfo.columns ?? []) {
    const label =
      typeof (col as any).label === "string" && (col as any).label.length > 0
        ? (col as any).label
        : typeof (col as any).fields?.label === "string"
        ? (col as any).fields.label
        : null;
    const columnId =
      typeof (col as any).id === "string" && (col as any).id.length > 0
        ? (col as any).id
        : typeof (col as any).fields?.colRef === "number"
        ? `C${(col as any).fields.colRef}`
        : typeof (col as any).fields?.id === "string"
        ? (col as any).fields.id
        : null;

    if (!label || !columnId) continue;
    map[label] = columnId; // label → ID 매핑
  }

  console.log("🧩 Column map loaded:", map);
  COLUMN_MAP_CACHE = map;
  return COLUMN_MAP_CACHE;
}

// -----------------------------------------------------------
// 3️⃣ 전체 데이터 조회
// -----------------------------------------------------------
async function getAllGristRows(): Promise<GristRow[]> {
  const { baseUrl, docId, apiKey } = getConfig();

  // ① 컬럼 매핑 먼저 가져오기
  const tableInfo = await loadTableInfo();
  const columnMap = await getColumnMap();
  const projectCol = columnMap[COLUMN_LABELS.project];
  const itemCol = columnMap[COLUMN_LABELS.item];
  const descriptionCol = columnMap[COLUMN_LABELS.description];
  const doneCol = columnMap[COLUMN_LABELS.done];
  const statusCol = columnMap[COLUMN_LABELS.status];
  const dateCol = columnMap[COLUMN_LABELS.date];
  const completedAtCol = columnMap[COLUMN_LABELS.completedAt];

  // ② 데이터 요청
  const res = await fetch(`${baseUrl}/api/docs/${docId}/tables/${tableInfo.id}/records`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Grist list failed: ${res.status} ${res.statusText} ${text}`);
  }

  const json = await res.json();

  // ③ 매핑 기반으로 데이터 변환
  return (json.records ?? []).map((r: any) => ({
    id: String(r.id),
    project: projectCol ? r.fields[projectCol] : undefined,
    item: itemCol ? r.fields[itemCol] : undefined,
    description: descriptionCol ? r.fields[descriptionCol] : undefined,
    done: doneCol ? r.fields[doneCol] : undefined,
    status: statusCol ? r.fields[statusCol] : undefined,
    date: dateCol ? r.fields[dateCol] : undefined,
    completedAt: completedAtCol ? r.fields[completedAtCol] : undefined,
  }));
}

function resolveColumnId(
  columnMap: Record<string, string>,
  key: ColumnKey,
  options: { required?: boolean } = {}
) {
  const label = COLUMN_LABELS[key];
  const columnId = columnMap[label];
  if (!columnId && options.required) {
    throw new Error(`Column "${label}" not found in the Grist table.`);
  }
  return columnId;
}

function buildFieldPayload(columnMap: Record<string, string>, values: ColumnInput) {
  const fields: Record<string, unknown> = {};
  (Object.keys(values) as ColumnKey[]).forEach((key) => {
    const value = values[key];
    if (typeof value === "undefined") return;
    const columnId = resolveColumnId(columnMap, key, { required: key === "project" || key === "item" });
    if (!columnId) return;
    fields[columnId] = value;
  });
  return fields;
}

async function submitRecords(method: "POST" | "PATCH", records: GristRecordPayload[]) {
  const { baseUrl, docId, apiKey } = getConfig();
  const tableInfo = await loadTableInfo();
  const res = await fetch(`${baseUrl}/api/docs/${docId}/tables/${tableInfo.id}/records`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ records }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Grist ${method === "POST" ? "insert" : "update"} failed: ${res.status} ${res.statusText} ${text}`);
  }

  return res.json();
}

type UpdateRowInput = {
  item?: string;
  description?: string;
  status?: string;
  done?: boolean;
};

export async function updateRow(rowId: string | number, updates: UpdateRowInput) {
  const numericId = Number(rowId);
  if (!Number.isFinite(numericId)) {
    throw new Error(`Row id must be a number, received "${rowId}".`);
  }

  const fields = buildFieldPayload(await getColumnMap(), {
    item: updates.item,
    description: updates.description,
    status: updates.status,
    done: updates.done,
  });

  if (!Object.keys(fields).length) {
    throw new Error("No fields provided to update.");
  }

  const json = await submitRecords("PATCH", [{ id: numericId, fields }]);

  if (json && json.records && json.records.length > 0) {
    return json.records[0];
  }
  return {
    id: numericId,
    fields,
  };
}

type InsertRowInput = {
  project: string;
  item: string;
  description?: string;
  status?: string;
  done?: boolean;
};

export async function insertRow(input: InsertRowInput) {
  if (!input.project || !input.item) {
    throw new Error("project and item are required to insert a row.");
  }

  const columnMap = await getColumnMap();
  const statusValue = typeof input.status === "undefined" ? "R" : input.status;
  const fields = buildFieldPayload(columnMap, {
    project: input.project,
    item: input.item,
    description: input.description,
    status: statusValue,
    done: input.done,
  });

  const projectCol = resolveColumnId(columnMap, "project", { required: true });
  const itemCol = resolveColumnId(columnMap, "item", { required: true });

  if (!projectCol || !itemCol) {
    throw new Error("Unable to resolve required columns for project or item.");
  }

  const json = await submitRecords("POST", [{ fields }]);
  const record = json.records?.[0];

  if (typeof statusValue !== "undefined" && record?.id != null) {
    try {
      await updateRow(record.id, { status: statusValue });
    } catch (err) {
      console.warn("⚠️ Failed to enforce status on insert:", err);
    }
  }

  return record;
}

export async function getRowById(rowId: string | number): Promise<GristRow | null> {
  const rows = await getAllGristRows();
  return rows.find((row) => row.id === String(rowId)) ?? null;
}

export async function getAllRows(): Promise<GristRow[]> {
  return getAllGristRows();
}

export function __resetGristTestState() {
  GRIST_CONFIG = null;
  TABLE_INFO = null;
  COLUMN_MAP_CACHE = null;
}

// -----------------------------------------------------------
// 4️⃣ Relay Network & Environment
// -----------------------------------------------------------
const network = Network.create(async (params, variables) => {
  switch (params.name) {
    case "main_AllRowsQuery": {
      const rows = await getAllGristRows();
      return { data: { rows } };
    }
    default:
      throw new Error(`Unknown operation: ${params.name}`);
  }
});

const environment = new Environment({
  network,
  store: new Store(new RecordSource()),
});

export default environment;
interface GristRecordPayload {
  id?: number;
  fields: Record<string, unknown>;
}

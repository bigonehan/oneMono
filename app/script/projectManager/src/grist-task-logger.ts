import { CliState, configureEnvForState, loadState } from "./grist.ts";
import { insertRow, updateRow } from "../infra/relay";

function resolveState(overrides?: Partial<CliState>): CliState {
  const base = loadState();
  return {
    tableId: overrides?.tableId ?? base.tableId,
    projectId: overrides?.projectId ?? base.projectId,
    currentId: overrides?.currentId ?? base.currentId,
  };
}

interface TaskStartInput {
  item: string;
  description: string;
  status?: string;
  done?: boolean;
  projectId?: string;
  tableId?: string;
}

export async function logTaskStart(input: TaskStartInput) {
  if (!input.item || !input.description) {
    throw new Error("item과 description은 필수입니다.");
  }

  const state = resolveState({
    projectId: input.projectId,
    tableId: input.tableId,
  });
  configureEnvForState(state);

  const record = await insertRow({
    project: state.projectId,
    item: input.item,
    description: input.description,
    status: input.status,
    done: input.done ?? false,
  });

  return record;
}

interface TaskCompleteInput {
  rowId: string | number;
  description?: string;
  status?: string;
  done?: boolean;
}

export async function markTaskComplete(input: TaskCompleteInput) {
  if (!input.rowId) {
    throw new Error("rowId는 필수입니다.");
  }
  const state = resolveState();
  configureEnvForState(state);

  const record = await updateRow(input.rowId, {
    description: input.description,
    status: typeof input.status === "undefined" ? "done" : input.status,
    done: typeof input.done === "undefined" ? true : input.done,
  });

  return record;
}

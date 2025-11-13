// tmux.ts
import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const MANAGER_PANE_FILE = join(process.cwd(), ".tmux-manager-pane");
const MANAGER_SOCKET_FILE = join(process.cwd(), ".tmux-manager-socket");
let cachedManagerPaneId: string | null = null;
let cachedTmuxSocket: string | null = null;
const isMcpContext = process.env.MCP_MODE === "1";
const log = (...args: unknown[]) => {
  (isMcpContext ? console.error : console.log)(...args);
};

function runTmuxCommand(cmd: string): string {
  try {
    const env = { ...process.env };
    if (!env.TMUX) {
      const socket = getManagerSocket();
      if (socket) {
        env.TMUX = socket;
      }
    }
    const result = execSync(`tmux ${cmd}`, { encoding: "utf-8", env });
    return result.trim();
  } catch (err: any) {
    console.error("[tmux error]", err.stderr?.toString() ?? err.message);
    return "";
  }
}

function saveManagerPaneId(paneId: string) {
  cachedManagerPaneId = paneId;
  writeFileSync(MANAGER_PANE_FILE, paneId, { encoding: "utf-8" });
}

function saveManagerSocket(socket: string | null) {
  if (!socket) return;
  cachedTmuxSocket = socket;
  writeFileSync(MANAGER_SOCKET_FILE, socket, { encoding: "utf-8" });
}

/**
 * 현재 세션 기준으로 새 pane을 만들고 메시지를 출력합니다.
 * @param message pane에서 실행할 문자열 (기본값: "Hello World")
 */
export function createPaneAndRun(message = "Hello World") {
  log("👉 Creating new tmux pane in current session...");
  runTmuxCommand("split-window -h"); // 현재 세션에 새 pane 생성

  // pane 목록 가져오기 (현재 세션 기준)
  const panes = runTmuxCommand('list-panes -F "#{pane_id}"').split("\n");
  const targetPane = panes[panes.length - 1];

  log(`👉 Sending message '${message}' to ${targetPane}`);
  runTmuxCommand(`send-keys -t ${targetPane} "echo ${message}" C-m`);
}

export function getCurrentPaneId(): string {
  const paneId = runTmuxCommand('display-message -p "#{pane_id}"');
  if (!paneId) {
    throw new Error("현재 pane ID를 가져오지 못했습니다.");
  }
  return paneId;
}

export function getManagerPaneId(): string | null {
  if (cachedManagerPaneId) {
    return cachedManagerPaneId;
  }
  if (!existsSync(MANAGER_PANE_FILE)) {
    return null;
  }

  try {
    const paneId = readFileSync(MANAGER_PANE_FILE, { encoding: "utf-8" }).trim();
    cachedManagerPaneId = paneId || null;
    return cachedManagerPaneId;
  } catch {
    return null;
  }
}

function getManagerSocket(): string | null {
  if (cachedTmuxSocket) {
    return cachedTmuxSocket;
  }
  if (!existsSync(MANAGER_SOCKET_FILE)) {
    return null;
  }
  try {
    const socket = readFileSync(MANAGER_SOCKET_FILE, { encoding: "utf-8" }).trim();
    cachedTmuxSocket = socket || null;
    return cachedTmuxSocket;
  } catch {
    return null;
  }
}

export function ensureManagerPaneId(): string {
  const existing = getManagerPaneId();
  if (existing) {
    return existing;
  }

  const currentPaneId = getCurrentPaneId();
  log(`🗂️  Manager pane locked to ${currentPaneId}`);
  saveManagerPaneId(currentPaneId);
  saveManagerSocket(process.env.TMUX ?? null);
  return currentPaneId;
}

export function getManagerPanePath(): string | null {
  const paneId = getManagerPaneId();
  if (!paneId) {
    return null;
  }
  const path = runTmuxCommand(`display-message -p -t ${paneId} "#{pane_current_path}"`);
  return path || null;
}

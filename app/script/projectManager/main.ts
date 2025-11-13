#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { resolve, isAbsolute } from "path";
import { ensureManagerPaneId, getManagerPanePath } from "./src/tmux.ts";
import { logTaskStart, markTaskComplete } from "./src/grist-task-logger.ts";
import { CliState, loadState, writeState } from "./src/grist.ts";

process.env.MCP_MODE = "1";
console.error("onePM: TMUX env:", process.env.TMUX ?? "none");
process.on("uncaughtException", (err) => {
  console.error("[onePM] uncaught exception:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("[onePM] unhandled rejection:", reason);
});

// Tmux 명령 실행 헬퍼
function runTmuxCommand(cmd: string): string {
  try {
    const result = execSync(`tmux ${cmd}`, { encoding: "utf-8" });
    return result.trim();
  } catch (err: any) {
    throw new Error(err.stderr?.toString() ?? err.message);
  }
}

// MCP 서버 생성
const server = new Server(
  {
    name: "onePM",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 도구 목록 정의
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "tmux_create_pane",
        description: "현재 tmux 세션에 새 pane을 생성하고 명령을 실행합니다",
        inputSchema: {
          type: "object",
          properties: {
            command: {
              type: "string",
              description: "새 pane에서 실행할 명령어 (기본값: echo 'Hello World')",
            },
            direction: {
              type: "string",
              enum: ["horizontal", "vertical"],
              description: "분할 방향 (horizontal: -h, vertical: -v, 기본값: horizontal)",
            },
          },
        },
      },
      {
        name: "tmux_create_logged_pane",
        description: "새 pane을 열고 해당 작업을 Grist에 기록합니다",
        inputSchema: {
          type: "object",
          properties: {
            item: {
              type: "string",
              description: "Grist에 남길 작업 제목",
            },
            description: {
              type: "string",
              description: "작업 설명",
            },
            command: {
              type: "string",
              description: "pane에서 실행할 명령어 (기본값: echo '<item>')",
            },
            status: {
              type: "string",
              description: "Grist status 값 (기본값: R)",
            },
            project_id: {
              type: "string",
              description: "override project id (선택)",
            },
            table_id: {
              type: "string",
              description: "override table id (선택)",
            },
            direction: {
              type: "string",
              enum: ["horizontal", "vertical"],
              description: "분할 방향 (horizontal: -h, vertical: -v, 기본값: horizontal)",
            },
          },
          required: ["item", "description"],
        },
      },
      {
        name: "tmux_send_keys",
        description: "특정 tmux pane에 키 입력을 전송합니다",
        inputSchema: {
          type: "object",
          properties: {
            pane_id: {
              type: "string",
              description: "대상 pane ID (예: %0, %1)",
            },
            keys: {
              type: "string",
              description: "전송할 키 입력 문자열",
            },
            enter: {
              type: "boolean",
              description: "Enter 키를 함께 전송할지 여부 (기본값: true)",
            },
          },
          required: ["pane_id", "keys"],
        },
      },
      {
        name: "tmux_list_panes",
        description: "현재 tmux 세션의 모든 pane 목록을 조회합니다",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "tmux_list_sessions",
        description: "모든 tmux 세션 목록을 조회합니다",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "tmux_kill_pane",
        description: "특정 tmux pane을 종료합니다",
        inputSchema: {
          type: "object",
          properties: {
            pane_id: {
              type: "string",
              description: "종료할 pane ID (예: %0, %1)",
            },
          },
          required: ["pane_id"],
        },
      },
      {
        name: "tmux_capture_pane",
        description: "특정 pane의 출력 내용을 캡처합니다",
        inputSchema: {
          type: "object",
          properties: {
            pane_id: {
              type: "string",
              description: "캡처할 pane ID (예: %0, %1)",
            },
            lines: {
              type: "number",
              description: "캡처할 라인 수 (기본값: 100)",
            },
          },
          required: ["pane_id"],
        },
      },
      {
        name: "grist_complete_task",
        description: "Grist row를 완료 상태로 업데이트합니다",
        inputSchema: {
          type: "object",
          properties: {
            row_id: {
              type: "number",
              description: "완료 처리할 row ID",
            },
            description: {
              type: "string",
              description: "최종 설명 (선택)",
            },
            status: {
              type: "string",
              description: "상태 코드 (기본값: done)",
            },
            done: {
              type: "boolean",
              description: "done 플래그 (기본값: true)",
            },
          },
          required: ["row_id"],
        },
      },
      {
        name: "one_coding",
        description: "plan.md를 읽고 각 작업에 대해 tmux pane을 띄우고 Grist를 기록합니다",
        inputSchema: {
          type: "object",
          properties: {
            workspace: {
              type: "string",
              description: "plan.md가 위치한 작업 공간 경로 (기본: 서버 작업 경로)",
            },
            plan_path: {
              type: "string",
              description: "plan 파일 경로 (기본: plan.md)",
            },
            agent_command: {
              type: "string",
              description: "{workspace}, {slug}, {description} 토큰을 사용할 수 있는 pane 실행 명령. 기본: cd {workspace} && codex \"project:{slug}\"",
            },
            direction: {
              type: "string",
              enum: ["horizontal", "vertical"],
              description: "분할 방향 (기본: horizontal)",
            },
          },
        },
      },
    ],
  };
});

// 도구 실행 핸들러
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    ensureManagerPaneId();

    switch (name) {
      case "tmux_create_pane": {
        const command = args?.command || "echo 'Hello World'";
        const direction = args?.direction === "vertical" ? "-v" : "-h";
        
        runTmuxCommand(`split-window ${direction}`);
        const panes = runTmuxCommand('list-panes -F "#{pane_id}"').split("\n");
        const targetPane = panes[panes.length - 1];
        
        runTmuxCommand(`send-keys -t ${targetPane} "${command}" C-m`);
        
        return {
          content: [
            {
              type: "text",
              text: `✅ 새 pane ${targetPane} 생성 완료\n실행 명령: ${command}`,
            },
          ],
        };
      }

      case "tmux_create_logged_pane": {
        const item = args?.item;
        const description = args?.description;
        if (!item || !description) {
          throw new Error("item과 description은 필수입니다");
        }
        const command = args?.command || `echo '${item}'`;
        const direction = args?.direction === "vertical" ? "-v" : "-h";

        runTmuxCommand(`split-window ${direction}`);
        const panes = runTmuxCommand('list-panes -F "#{pane_id}"').split("\n");
        const targetPane = panes[panes.length - 1];

        runTmuxCommand(`send-keys -t ${targetPane} "${command}" C-m`);

        const record = await logTaskStart({
          item,
          description,
          status: args?.status,
          projectId: args?.project_id,
          tableId: args?.table_id,
          done: false,
        });

        const rowId = record?.id ?? null;

        return {
          content: [
            {
              type: "text",
              text: `✅ Pane ${targetPane} 생성 및 작업 기록 완료\n- 실행 명령: ${command}\n- Grist row: ${rowId ?? "unknown"}`,
            },
          ],
        };
      }

      case "tmux_send_keys": {
        const paneId = args?.pane_id;
        const keys = args?.keys;
        const enter = args?.enter !== false;
        
        if (!paneId || !keys) {
          throw new Error("pane_id와 keys는 필수 인자입니다");
        }
        
        const enterKey = enter ? " C-m" : "";
        runTmuxCommand(`send-keys -t ${paneId} "${keys}"${enterKey}`);
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Pane ${paneId}에 키 전송 완료: ${keys}`,
            },
          ],
        };
      }

      case "tmux_list_panes": {
        const panes = runTmuxCommand(
          'list-panes -F "#{pane_id} | #{pane_width}x#{pane_height} | #{pane_current_command}"'
        );
        
        return {
          content: [
            {
              type: "text",
              text: `현재 세션의 pane 목록:\n${panes}`,
            },
          ],
        };
      }

      case "tmux_list_sessions": {
        const sessions = runTmuxCommand(
          'list-sessions -F "#{session_name} | #{session_windows} windows | #{session_attached} attached"'
        );
        
        return {
          content: [
            {
              type: "text",
              text: `Tmux 세션 목록:\n${sessions}`,
            },
          ],
        };
      }

      case "tmux_kill_pane": {
        const paneId = args?.pane_id;
        
        if (!paneId) {
          throw new Error("pane_id는 필수 인자입니다");
        }
        
        runTmuxCommand(`kill-pane -t ${paneId}`);
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Pane ${paneId} 종료 완료`,
            },
          ],
        };
      }

      case "tmux_capture_pane": {
        const paneId = args?.pane_id;
        const lines = args?.lines || 100;
        
        if (!paneId) {
          throw new Error("pane_id는 필수 인자입니다");
        }
        
        const output = runTmuxCommand(
          `capture-pane -t ${paneId} -p -S -${lines}`
        );
        
        return {
          content: [
            {
              type: "text",
              text: `Pane ${paneId} 출력 (최근 ${lines}줄):\n\n${output}`,
            },
          ],
        };
      }

      case "grist_complete_task": {
        const rowId = args?.row_id;
        if (typeof rowId === "undefined" || rowId === null) {
          throw new Error("row_id는 필수 인자입니다");
        }

        const record = await markTaskComplete({
          rowId,
          description: args?.description,
          status: args?.status,
          done: args?.done,
        });

        return {
          content: [
            {
              type: "text",
              text: `✅ Grist row ${record?.id ?? rowId} 완료 처리`,
            },
          ],
        };
      }

      case "one_coding": {
        const workspaceArg = (() => {
          if (args?.workspace) {
            if (!isAbsolute(args.workspace)) {
              throw new Error("workspace 인자는 절대 경로로 전달해야 합니다");
            }
            return args.workspace;
          }
          ensureManagerPaneId();
          return getDefaultWorkspace();
        })();
        const planArg = args?.plan_path || "plan.md";

        const resolveWorkspacePath = (input?: string | null) => {
          if (!input) return null;
          const trimmed = input.trim();
          if (!trimmed) return null;
          return isAbsolute(trimmed) ? trimmed : resolve(process.cwd(), trimmed);
        };

        const candidatePlanPaths: string[] = [];
        const planEnvPath = process.env.ONEPM_PLAN_PATH?.trim();
        if (planEnvPath) {
          candidatePlanPaths.push(
            isAbsolute(planEnvPath) ? planEnvPath : resolve(workspaceArg, planEnvPath)
          );
        }
        if (isAbsolute(planArg)) {
          candidatePlanPaths.push(planArg);
        } else {
          const candidateWorkspaces = [
            workspaceArg,
            resolveWorkspacePath(process.env.ONEPM_WORKSPACE ?? null),
            getManagerPanePath(),
            process.cwd(),
          ].filter((value, index, self): value is string => !!value && self.indexOf(value) === index);

          for (const base of candidateWorkspaces) {
            candidatePlanPaths.push(resolve(base, planArg));
          }
        }

        const planPath = candidatePlanPaths.find((candidate) => existsSync(candidate));
        if (!planPath) {
          throw new Error(
            `plan 파일을 찾을 수 없습니다. 확인한 경로:\n${candidatePlanPaths
              .map((candidate) => `- ${candidate}`)
              .join("\n")}`
          );
        }

        const planContent = readFileSync(planPath, "utf-8");
        const config = parsePlanConfig(planContent);
        if (!config.tableId || !config.projectId) {
          throw new Error("plan Config 섹션에서 tableId/projectId를 찾지 못했습니다");
        }

        syncGristState(config.tableId, config.projectId);

        const tasks = parsePlanTasks(planContent);
        if (!tasks.length) {
          throw new Error("plan Tasks 섹션에서 실행할 항목을 찾지 못했습니다");
        }

        ensureManagerPaneId();

        const direction = args?.direction === "vertical" ? "-v" : "-h";
        const commandTemplate =
          args?.agent_command ||
          'cd {workspace} && codex "project:{slug} :: {description}"';

        const runs = [];
        for (const task of tasks) {
          const record = await logTaskStart({
            item: task.slug,
            description: task.description,
            status: "R",
            done: false,
          });

          runTmuxCommand(`split-window ${direction}`);
          const panes = runTmuxCommand('list-panes -F "#{pane_id}"').split("\n");
          const targetPane = panes[panes.length - 1];

          const command = fillTemplate(commandTemplate, {
            workspace: workspaceArg,
            slug: task.slug,
            description: task.description,
          });
          runTmuxCommand(
            `send-keys -t ${targetPane} "${escapeTmux(command)}" C-m`
          );

          runs.push({
            task: task.slug,
            description: task.description,
            pane: targetPane,
            rowId: record?.id ?? null,
          });
        }

        return {
          content: [
            {
              type: "text",
              text:
                "✅ one:coding 실행 결과\n" +
                runs
                  .map(
                    (run) =>
                      `- ${run.task} → pane ${run.pane}, Grist row ${run.rowId ?? "?"}`
                  )
                  .join("\n"),
            },
          ],
        };
      }

      default:
        throw new Error(`알 수 없는 도구: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `❌ 오류 발생: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// 서버 시작
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Tmux MCP 서버가 시작되었습니다");
  const keepAlive = setInterval(() => {
    // Keep event loop alive while waiting for the MCP client to talk to us.
  }, 60_000);
  await new Promise<void>((resolve) => {
    server.onclose = () => {
      console.error("Tmux MCP 서버 연결이 종료되었습니다");
      clearInterval(keepAlive);
      resolve();
    };
    server.onerror = (error) => {
      console.error("서버 오류:", error);
      clearInterval(keepAlive);
      resolve();
    };
  });
}

main().catch((error) => {
  console.error("서버 오류:", error);
  process.exit(1);
});

function parsePlanConfig(plan: string) {
  const match = /##\s*Config([\s\S]*?)(##|$)/i.exec(plan);
  const config: { tableId?: string; projectId?: string } = {};
  if (!match) {
    return config;
  }
  match[1]
    .split("\n")
    .map((line) => line.trim())
    .forEach((line) => {
      const entry = /^-\s*([\w-]+):\s*(.+)$/i.exec(line);
      if (!entry) return;
      const key = entry[1].toLowerCase();
      const value = entry[2].trim();
      if (key === "tableid") config.tableId = value;
      if (key === "projectid") config.projectId = value;
    });
  return config;
}

function parsePlanTasks(plan: string) {
  const match = /##\s*Tasks([\s\S]*?)(##|$)/i.exec(plan);
  if (!match) return [];
  return match[1]
    .split("\n")
    .map((line) => line.trim())
    .map((line) => {
      const entry = /^-\s*(.+?)\s*::\s*(.+)$/.exec(line);
      if (!entry) return null;
      return { slug: entry[1].trim(), description: entry[2].trim() };
    })
    .filter((item): item is { slug: string; description: string } => Boolean(item));
}

function syncGristState(tableId: string, projectId: string) {
  let current: CliState | null = null;
  try {
    current = loadState();
  } catch (err) {
    // ignore missing state
  }
  if (
    !current ||
    current.tableId !== tableId ||
    current.projectId !== projectId
  ) {
    writeState({ tableId, projectId }, { quiet: true });
  }
}

function fillTemplate(
  template: string,
  vars: Record<"workspace" | "slug" | "description", string>
) {
  return template
    .replace(/{workspace}/g, vars.workspace)
    .replace(/{slug}/g, vars.slug)
    .replace(/{description}/g, vars.description);
}

function escapeTmux(command: string) {
  return command.replace(/(["\\$`])/g, "\\$1");
}

function getDefaultWorkspace() {
  const fromEnv = process.env.ONEPM_WORKSPACE?.trim();
  if (fromEnv) {
    return isAbsolute(fromEnv) ? fromEnv : resolve(process.cwd(), fromEnv);
  }
  const panePath = getManagerPanePath();
  if (panePath) {
    return panePath;
  }
  return process.cwd();
}

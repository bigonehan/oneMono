# MCP Workflow Guide

This repo hosts the MCP automation that spins up Codex agents, manages tmux panes, and logs tasks to Grist. Follow this guide whenever you work on a project through MCP.

## 1. Prepare `plan.md`
Every workspace where you intend to run `one:coding` must contain a `plan.md` with the following schema:

```md
# <project name>

## Config
- id: <grist project id>
- description: <what needs to be built>
- stack: <libraries/tools to prefer>
- request: <extra requirements or constraints>
```

Keep the file in the directory where you’ll start Codex.

### Example `plan.md`
```md
# Awesome Feature

## Config
- id: app_123
- description: Enhance onboarding flow
- stack: Next.js, Tailwind, tRPC
- request: Cover responsive layout and e2e tests

## Tasks
- structure :: Draft domain notes
- plan :: Convert notes into actionable steps
- build :: Implement the feature + tests
```

## 2. Launch the MCP session
1. Start a tmux session in the target workspace.
2. Run `one:coding`. The MCP server reads `plan.md` plus `rules/bootstrap.md` and bootstraps the workflow.

## 3. Automatic flow (enforced via `rules/bootstrap.md`)
1. **Structure notes** – Codex creates `rules/structure.md` containing plain-text domain knowledge derived from `plan.md`.
2. **Task list** – Codex generates `rules/task.md` where each entry follows ``(input type)=>output type : 설명`` and satisfies both `description` and `request`.
3. **Plan validation** – MCP opens a new tmux pane/agent to cross-check `plan.md`, `rules/structure.md`, and `rules/task.md`. It amends the files if needed, signals completion, then closes that pane.
4. **Task execution** – For every task:
   - A Grist row is added using the project id from `plan.md`.
   - A dedicated tmux pane is opened to run the task. The agent implements the work, runs unit tests or builds as required, marks the Grist row complete, and closes the pane.

## 4. Commands & scripts
- Install deps: `bun install`
- Start MCP server (if not already running): `bun run main.ts`
- Invoke `one:coding`: run it inside tmux within the directory that holds `plan.md`.
- One-shot helper: `scripts/run-one-project.sh` boots the MCP server in the background, keeps your working directory, and runs any `one:<flow>` command (default: `one:coding`). You can pass either `coding` or `one:coding`, plus extra Codex flags:
  ```bash
  scripts/run-one-project.sh story -- --no-color
  ```
  Add an alias in `~/.zshrc` for convenience:
  ```zsh
  alias onecode='/home/tree/project/oneMono/app/script/projectManager/scripts/run-one-project.sh'
  ```
  The launcher sets `ONEPM_WORKSPACE` to your current repo, records the selected flow in `ONEPM_FLOW`, and, when present, exposes `rules/<flow>.md` via `ONEPM_RULES_FILE` so specialized rule files (e.g., `rules/coding.md`, `rules/story.md`) are automatically discoverable.
- Inspect Grist data before editing `plan.md`:  
  - `scripts/run-one-project.sh` will still use whatever `tableId` you provide.
  - `scripts/list-grist-rows.sh <table|number> [--limit N]` prints the rows for a specific table (e.g., `scripts/list-grist-rows.sh 13` shows `Table13`). Alias it (e.g., `alias gristrows='…/scripts/list-grist-rows.sh'`) to quickly grab IDs/names and confirm contents before updating `## Config`.

## 5. Troubleshooting
- **No tmux pane appears** – ensure `main.ts` is running and that `one:coding` was executed inside tmux.
- **Grist logging fails** – verify `.grist-cli.json` contains the correct table/project ids referenced by `plan.md`.
- **Flow skipped structure/task files** – confirm `plan.md` exists and follows the schema above; MCP will only create `rules/structure.md` and `rules/task.md` when the plan parses correctly.

With these steps, every MCP run consistently documents plans, verifies them, and executes tasks with full Grist traceability.

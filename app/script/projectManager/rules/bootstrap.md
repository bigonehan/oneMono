# Bootstrap Rules

- `plan.md` must follow the schema `id`, `description`, `stack`, `request`; every project kicks off by confirming those fields.

## Flow
1. Read `plan.md`, then draft domain notes in `rules/structure.md` before writing any code.
2. Create `rules/task.md` so its tasks satisfy `plan.md`'s `description` and `request`.
3. Open a fresh tmux pane/agent to cross-check `plan.md`, `rules/structure.md`, and `rules/task.md`, update the plan if needed, signal completion, then close the pane.
4. Use Grist (referencing the `plan.md` project id) to log each task; drive every task from its own tmux pane, run required tests, mark the Grist row done, and close the pane when finished.

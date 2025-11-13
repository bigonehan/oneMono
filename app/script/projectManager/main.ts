// main.ts
import { createPaneAndRun } from "./src/tmux.ts";

async function main() {
  await createPaneAndRun("Hello from Tmux!");
}

main();

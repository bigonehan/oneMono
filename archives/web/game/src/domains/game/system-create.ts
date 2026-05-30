import { create_game_stage, type GameStage } from "@domains/game/stage-create";

export type SystemStatus = "idle" | "loaded" | "started";

export type GameSystem = {
  status: SystemStatus;
  stage: GameStage;
  load_system: () => void;
  start_system: () => void;
};

export function create_game_system(): GameSystem {
  const stage = create_game_stage();

  return {
    status: "idle",
    stage,
    load_system() {
      this.stage.load_stage();
      this.status = "loaded";
    },
    start_system() {
      if (this.status !== "loaded") {
        return;
      }
      this.stage.start_stage();
      this.status = "started";
    }
  };
}

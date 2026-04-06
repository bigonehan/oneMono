import { create_game_character, type CharacterInput, type GameCharacter } from "@domains/game/character-create";

export type StageStatus = "idle" | "loaded" | "started" | "ended";

export type GameStage = {
  status: StageStatus;
  character: GameCharacter;
  load_stage: () => void;
  start_stage: () => void;
  end_stage: () => void;
  input_stage: (input: CharacterInput) => void;
};

export function create_game_stage(): GameStage {
  const character = create_game_character();

  return {
    status: "idle",
    character,
    load_stage() {
      this.character.load_character();
      this.status = "loaded";
    },
    start_stage() {
      if (this.status === "loaded" || this.status === "ended") {
        this.status = "started";
      }
    },
    end_stage() {
      this.status = "ended";
    },
    input_stage(input: CharacterInput) {
      if (this.status !== "started") {
        return;
      }
      this.character.input_character(input);
    }
  };
}

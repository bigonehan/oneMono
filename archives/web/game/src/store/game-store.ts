import { create } from "zustand";
import { create_game_system } from "@domains/game";

type Store = {
  system: ReturnType<typeof create_game_system>;
  refreshKey: number;
  load_game: () => void;
  start_game: () => void;
  end_stage: () => void;
  click_stage: (worldX: number, worldZ: number) => void;
};

export const use_game_store = create<Store>((set, get) => ({
  system: create_game_system(),
  refreshKey: 0,
  load_game: () => {
    const { system } = get();
    system.load_system();
    set((state) => ({ refreshKey: state.refreshKey + 1 }));
  },
  start_game: () => {
    const { system } = get();
    system.start_system();
    set((state) => ({ refreshKey: state.refreshKey + 1 }));
  },
  end_stage: () => {
    const { system } = get();
    system.stage.end_stage();
    set((state) => ({ refreshKey: state.refreshKey + 1 }));
  },
  click_stage: (worldX: number, worldZ: number) => {
    const { system } = get();
    system.stage.input_stage({ type: "click", worldX, worldZ });
    set((state) => ({ refreshKey: state.refreshKey + 1 }));
  }
}));

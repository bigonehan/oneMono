import type { Board, NewBoard } from "../models/board.js";

export const create_board_model = (input: NewBoard, id: string): Board => {
  const now = new Date().toISOString();

  return {
    id,
    name: input.name,
    description: input.description ?? null,
    owner_id: input.owner_id,
    visibility: input.visibility ?? "private",
    created_at: now,
    modified_at: now,
  };
};

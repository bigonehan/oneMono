import type { Board, NewBoard } from "./models/board.js";

export interface BoardPort {
  createBoard(input: NewBoard): Promise<Board>;
  getBoardById(boardId: string): Promise<Board | null>;
  listBoards(): Promise<Board[]>;
  listBoardsByOwner(ownerId: string): Promise<Board[]>;
  updateBoard(boardId: string, input: Partial<NewBoard>): Promise<Board | null>;
  deleteBoard(boardId: string): Promise<boolean>;
}

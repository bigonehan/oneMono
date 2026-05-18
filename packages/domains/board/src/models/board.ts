import * as Schema from "effect/Schema";

export const BoardVisibility = Schema.Literal("public", "private");

export type BoardVisibility = Schema.Schema.Type<typeof BoardVisibility>;

export const Board = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  description: Schema.NullOr(Schema.String),
  owner_id: Schema.String,
  visibility: BoardVisibility,
  created_at: Schema.String,
  modified_at: Schema.String,
});

export type Board = Schema.Schema.Type<typeof Board>;

export const NewBoard = Schema.Struct({
  name: Schema.String,
  description: Schema.optional(Schema.NullOr(Schema.String)),
  owner_id: Schema.String,
  visibility: Schema.optional(BoardVisibility),
});

export type NewBoard = Schema.Schema.Type<typeof NewBoard>;

import * as Schema from "effect/Schema";

export const User = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  pw: Schema.String,
  created_at: Schema.String,
  modified_at: Schema.String,
});

export type User = Schema.Schema.Type<typeof User>;

export const NewUser = Schema.Struct({
  name: Schema.String,
  pw: Schema.String,
});

export type NewUser = Schema.Schema.Type<typeof NewUser>;

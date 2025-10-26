import * as Schema from "effect/Schema"

import { makeStringId, type StringId } from "@domains/core"

export type UserId = StringId<"UserId">
export const UserId = makeStringId<"UserId">()
export const UserIdSchema = Schema.String.pipe(Schema.brand("UserId"))

export const UserNameSchema = Schema.String.pipe(Schema.trimmed(), Schema.minLength(1))

export const UserSchema = Schema.Struct({
  id: UserIdSchema,
  name: UserNameSchema
})

export type User = Schema.Schema.Type<typeof UserSchema>

export const decodeUser = Schema.decodeUnknownSync(UserSchema)
export const decodeUsers = Schema.decodeUnknownSync(Schema.Array(UserSchema))

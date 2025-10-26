import * as Schema from "effect/Schema"

import { makeStringId, type StringId } from "@domains/core"
import { UserSchema, type User } from "@domains/user"

export type PostId = StringId<"PostId">
export const PostId = makeStringId<"PostId">()
export const PostIdSchema = Schema.String.pipe(Schema.brand("PostId"))

export const PostAuthorSchema = UserSchema
export type PostAuthor = User

export const PostSchema = Schema.Struct({
  id: PostIdSchema,
  title: Schema.String.pipe(Schema.trimmed(), Schema.minLength(1)),
  body: Schema.String.pipe(Schema.trimmed(), Schema.minLength(1)),
  createdAt: Schema.Date,
  user: PostAuthorSchema
})
export type Post = Schema.Schema.Type<typeof PostSchema>

export const CreatePostSchema = Schema.Struct({
  title: Schema.String.pipe(Schema.trimmed(), Schema.minLength(1)),
  body: Schema.String.pipe(Schema.trimmed(), Schema.minLength(1)),
  user: PostAuthorSchema
})
export type CreatePost = Schema.Schema.Type<typeof CreatePostSchema>

export const decodePost = Schema.decodeUnknownSync(PostSchema)
export const decodePosts = Schema.decodeUnknownSync(Schema.Array(PostSchema))
export const encodePost = Schema.encodeUnknownSync(PostSchema)

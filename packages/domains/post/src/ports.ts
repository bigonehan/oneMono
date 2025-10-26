import type { Effect } from "effect/Effect"

import type { CreatePost, Post, PostId } from "./post"

export interface PostRepository {
  readonly getById: (id: PostId) => Effect<Post | null, unknown, never>
  readonly list: () => Effect<ReadonlyArray<Post>, unknown, never>
  readonly create: (input: CreatePost) => Effect<Post, unknown, never>
}

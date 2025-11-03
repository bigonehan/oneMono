// packages/services/post/PostRepo.layer.ts
import { Layer, Context } from "effect"
import { PostPort } from "@domains/post/PostPort"
import { PostAdapterConsole } from "@adapters/post/PostAdapterConsole"

export class PostRepo extends Context.Tag("PostRepo")<
  PostRepo,
  PostPort
>() {}

export const PostRepoConsoleLive = Layer.succeed(PostRepo, new PostAdapterConsole())


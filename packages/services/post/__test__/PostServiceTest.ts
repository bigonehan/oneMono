// packages/services/post/__tests__/PostService.test.ts
import { describe, it, expect } from "vitest"
import { PostService } from "../PostService"
import { PostAdapterConsole } from "@adapters/post/PostAdapterConsole"

describe("PostService", () => {
  it("creates and lists posts", async () => {
    const repo = new PostAdapterConsole()
    const service = new PostService(repo)

    await service.createPost("tree", "hello effect")
    const posts = await service.listPosts()

    expect(posts.length).toBe(1)
    expect(posts[0].body).toBe("hello effect")
  })
})


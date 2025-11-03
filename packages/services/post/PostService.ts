// packages/services/post/PostService.ts
import { PostPort } from "@domains/post/PostPort"
import { createPost } from "@domains/post/Post"

export class PostService {
  constructor(private readonly repo: PostPort) {}

  async createPost(user: string, body: string) {
    if (!body.trim()) {
      throw new Error("내용이 비어 있습니다.")
    }
    await this.repo.create(createPost(user, body))
  }

  async listPosts() {
    return await this.repo.list()
  }

  async updatePost(id: string, body: string) {
    return this.repo.update(id, body)
  }
}

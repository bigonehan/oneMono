
// packages/adapters/post/PostAdapterConsole.ts
import { Post } from "@domains/post/Post"
import { PostPort } from "@domains/post/PostPort"

export class PostAdapterConsole implements PostPort {
  private memory: Post[] = []

  async create(post: Post): Promise<void> {
    this.memory.push(post)
    console.log("[ConsoleAdapter] Created:", post)
  }

  async getById(id: string): Promise<Post | undefined> {
    const post = this.memory.find((p) => p.id === id)
    console.log("[ConsoleAdapter] Read:", post)
    return post
  }

  async list(): Promise<Post[]> {
    console.log("[ConsoleAdapter] List:", this.memory)
    return [...this.memory]
  }

  async update(id: string, body: string): Promise<Post | undefined> {
    const post = this.memory.find((p) => p.id === id)
    if (!post) {
      console.warn(`[ConsoleAdapter] Update failed: post ${id} not found`)
      return undefined
    }
    post.body = body
    post.modifiedAt = new Date()
    console.log("[ConsoleAdapter] Updated:", post)
    return post
  }

  async delete(id: string): Promise<void> {
    const before = this.memory.length
    this.memory = this.memory.filter((p) => p.id !== id)
    const after = this.memory.length
    if (before === after) {
      console.warn(`[ConsoleAdapter] Delete failed: post ${id} not found`)
    } else {
      console.log("[ConsoleAdapter] Deleted:", id)
    }
  }
}

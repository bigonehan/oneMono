import fs from "node:fs";
import path from "node:path";
import type { IArticleDeleteUseCase } from "./article-usecase";

export class ArticleDeleteFileRepo implements IArticleDeleteUseCase {
  constructor(private readonly rootDir: string) {}

  async remove(slug: string): Promise<void> {
    const postsDir = path.join(this.rootDir, "posts");
    const target = fs
      .readdirSync(postsDir)
      .find((file) => file.endsWith(`-${slug}.md`) || file.replace(/\.md$/, "") === slug);

    if (!target) {
      throw new Error(`article not found: ${slug}`);
    }

    fs.unlinkSync(path.join(postsDir, target));
  }
}

import { describe, expect, it } from "vitest";
import { GelUserArticleAdapter } from "../src/user-gel-adapter.js";

describe("GelUserArticleAdapter", () => {
  it("creates user and article rows", async () => {
    const adapter = new GelUserArticleAdapter();
    const user = await adapter.createUser({ name: "Ada", pw: "secret" });

    await adapter.createArticle({
      title: "Hello",
      body: "world",
      rule: "public",
    });

    const rows = await adapter.listUserArticleRows(user.id);

    expect(rows).toHaveLength(1);
    expect(rows[0]?.userName).toBe("Ada");
    expect(rows[0]?.articleTitle).toBe("Hello");
  });

  it("deletes a user", async () => {
    const adapter = new GelUserArticleAdapter();
    const user = await adapter.createUser({ name: "Lin", pw: "pw" });

    const result = await adapter.deleteUser(user.id);

    expect(result).toBe(true);
    expect(await adapter.getUserById(user.id)).toBeNull();
  });
});

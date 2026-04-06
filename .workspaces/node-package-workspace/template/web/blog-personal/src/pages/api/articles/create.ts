import type { APIRoute } from "astro";
import { createArticle } from "@features/article";
import { get_workspace_root } from "../../../src/lib/root-resolve";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let payload: Record<string, unknown>;
  const workspace_root = get_workspace_root();

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response(JSON.stringify({ error: "invalid json body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    const created = await createArticle(workspace_root, {
      title: String(payload.title ?? ""),
      date: String(payload.date ?? ""),
      tags: Array.isArray(payload.tags) ? payload.tags.map((tag) => String(tag)) : [],
      category: String(payload.category ?? ""),
      description: String(payload.description ?? ""),
      content: String(payload.content ?? ""),
      series: payload.series ? String(payload.series) : undefined,
      seriesOrder: typeof payload.seriesOrder === "number" ? payload.seriesOrder : undefined,
    });

    return new Response(JSON.stringify(created), {
      status: 201,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "unknown error" }),
      {
        status: 400,
        headers: { "content-type": "application/json" },
      },
    );
  }
};

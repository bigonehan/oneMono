import type { APIRoute } from "astro";
import { getSearchIndex } from "../lib/posts";

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(await getSearchIndex()), {
    headers: { "content-type": "application/json" },
  });
};

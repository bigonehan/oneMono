import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next();
  // charset=utf-8 강제 지정
  response.headers.set("Content-Type", "text/html; charset=utf-8");
  return response;
};


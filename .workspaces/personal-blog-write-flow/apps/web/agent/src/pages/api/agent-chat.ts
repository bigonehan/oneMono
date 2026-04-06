import type { APIRoute } from "astro";
import { spawn } from "node:child_process";

type SiteConfig = {
  id: string;
  name: string;
  url: string;
  inputSelector: string;
  submitSelector: string;
  responseSelector: string;
};

type Payload = {
  prompt: string;
  site: SiteConfig;
};

const runAgentBrowser = (args: string[], timeoutMs = 90000): Promise<string> => {
  return new Promise((resolve, reject) => {
    const child = spawn("agent-browser", args, {
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    });

    const stdout: string[] = [];
    const stderr: string[] = [];

    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error(`agent-browser timeout: ${args.join(" ")}`));
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout.push(String(chunk));
    });

    child.stderr.on("data", (chunk) => {
      stderr.push(String(chunk));
    });

    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(stderr.join("").trim() || `agent-browser exited with code ${code}`));
        return;
      }
      resolve(stdout.join("").trim());
    });
  });
};

const validSite = (site: SiteConfig | undefined): site is SiteConfig => {
  if (!site) {
    return false;
  }

  return (
    site.url.trim().length > 0 &&
    site.inputSelector.trim().length > 0 &&
    site.submitSelector.trim().length > 0 &&
    site.responseSelector.trim().length > 0
  );
};

const toMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown server error";
};

export const POST: APIRoute = async ({ request }) => {
  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const prompt = payload.prompt?.trim();
  const site = payload.site;
  if (!prompt || !validSite(site)) {
    return new Response(JSON.stringify({ ok: false, error: "Missing prompt or site config" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    await runAgentBrowser(["open", site.url]);
    await runAgentBrowser(["wait", site.inputSelector]);
    await runAgentBrowser(["fill", site.inputSelector, prompt]);
    await runAgentBrowser(["click", site.submitSelector]);
    await runAgentBrowser(["wait", site.responseSelector]);
    const answer = await runAgentBrowser(["get", "text", site.responseSelector]);
    await runAgentBrowser(["close"], 15000).catch(() => undefined);

    return new Response(JSON.stringify({ ok: true, answer }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    await runAgentBrowser(["close"], 15000).catch(() => undefined);

    return new Response(JSON.stringify({ ok: false, error: toMessage(error) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};

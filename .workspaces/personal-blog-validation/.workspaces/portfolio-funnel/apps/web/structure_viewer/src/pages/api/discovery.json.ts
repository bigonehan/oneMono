import { discoverProjectDomains } from "../../domain/discovery";

export async function GET() {
  const payload = await discoverProjectDomains(process.cwd());

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

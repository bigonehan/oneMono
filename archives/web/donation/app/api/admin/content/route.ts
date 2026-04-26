import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { CampaignContent } from "@/lib/campaign-content";
import { assertAdminAccess, loadCampaignContent, saveCampaignContent } from "@/lib/campaign-content";

export const runtime = "nodejs";

export async function GET() {
  const content = await loadCampaignContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  try {
    const payload = (await request.json()) as CampaignContent & {
      adminToken?: string;
    };

    assertAdminAccess(payload.adminToken || null);

    const saved = await saveCampaignContent(payload);

    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json(saved);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to save campaign content.",
      },
      { status: 400 },
    );
  }
}

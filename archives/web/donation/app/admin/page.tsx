import { DonationAdmin } from "@/components/donation-admin";
import { loadCampaignContent } from "@/lib/campaign-content";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const content = await loadCampaignContent();

  return <DonationAdmin initialContent={content} />;
}

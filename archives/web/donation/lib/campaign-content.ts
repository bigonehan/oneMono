import { promises as fs } from "node:fs";
import path from "node:path";
import type { CSSProperties } from "react";

export type DonationPreset = {
  amountCents: number;
  label: string;
  impact: string;
};

export type CampaignTheme = {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  surface: string;
  border: string;
};

export type CampaignContent = {
  campaignName: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSummary: string;
  introHtml: string;
  detailHtml: string;
  ctaLabel: string;
  goalAmountCents: number;
  donationPresets: DonationPreset[];
  trustBadges: string[];
  theme: CampaignTheme;
};

type SaveCampaignPayload = CampaignContent & {
  adminToken?: string;
};

const DEFAULT_CONTENT: CampaignContent = {
  campaignName: "Neighborhood Table Fund",
  heroEyebrow: "Emergency Meal Support",
  heroTitle: "Keep the weekend kitchen open for 300 families.",
  heroSummary:
    "A one-page campaign that explains the mission, shows transparent progress, and sends donors into a Stripe checkout without losing context.",
  introHtml:
    "<p>Neighborhood Table is raising funds to keep the community kitchen open through the next quarter. Every donation helps cover produce, volunteer logistics, and emergency delivery runs for families who depend on the service.</p>",
  detailHtml:
    "<p>The campaign is structured around three promises: serve warm meals every weekend, publish transparent progress, and let organizers adjust the message and visual tone without a redeploy.</p><ul><li><strong>$25</strong> covers one family meal kit.</li><li><strong>$100</strong> covers a weekend delivery route.</li><li><strong>$250</strong> funds pantry restock for one evening service.</li></ul>",
  ctaLabel: "Donate with Stripe",
  goalAmountCents: 5000000,
  donationPresets: [
    { amountCents: 2500, label: "$25", impact: "One family meal kit" },
    { amountCents: 10000, label: "$100", impact: "Weekend delivery route" },
    { amountCents: 25000, label: "$250", impact: "Pantry restock" },
  ],
  trustBadges: ["Stripe checkout", "Transparent progress", "Weekly organizer updates"],
  theme: {
    background: "#16110a",
    foreground: "#f8f1e4",
    primary: "#f3c94f",
    secondary: "#ef8f35",
    accent: "#f5df8a",
    muted: "#746b60",
    surface: "#241b12",
    border: "#4c3d2c",
  },
};

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

function contentPath() {
  return path.join(process.cwd(), "data", "campaign-content.json");
}

function sanitizeHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+="[^"]*"/gi, "")
    .replace(/\son[a-z]+='[^']*'/gi, "");
}

function normalizeTheme(theme: CampaignTheme): CampaignTheme {
  return {
    background: HEX_COLOR.test(theme.background) ? theme.background : DEFAULT_CONTENT.theme.background,
    foreground: HEX_COLOR.test(theme.foreground) ? theme.foreground : DEFAULT_CONTENT.theme.foreground,
    primary: HEX_COLOR.test(theme.primary) ? theme.primary : DEFAULT_CONTENT.theme.primary,
    secondary: HEX_COLOR.test(theme.secondary) ? theme.secondary : DEFAULT_CONTENT.theme.secondary,
    accent: HEX_COLOR.test(theme.accent) ? theme.accent : DEFAULT_CONTENT.theme.accent,
    muted: HEX_COLOR.test(theme.muted) ? theme.muted : DEFAULT_CONTENT.theme.muted,
    surface: HEX_COLOR.test(theme.surface) ? theme.surface : DEFAULT_CONTENT.theme.surface,
    border: HEX_COLOR.test(theme.border) ? theme.border : DEFAULT_CONTENT.theme.border,
  };
}

export function normalizeCampaignContent(payload: SaveCampaignPayload): CampaignContent {
  const presets = Array.isArray(payload.donationPresets) && payload.donationPresets.length > 0
    ? payload.donationPresets
        .map((preset) => ({
          amountCents: Math.max(100, Math.round(Number(preset.amountCents) || 0)),
          label: String(preset.label || "").trim() || "$25",
          impact: String(preset.impact || "").trim() || "Campaign support",
        }))
        .slice(0, 3)
    : DEFAULT_CONTENT.donationPresets;

  return {
    campaignName: String(payload.campaignName || DEFAULT_CONTENT.campaignName).trim() || DEFAULT_CONTENT.campaignName,
    heroEyebrow: String(payload.heroEyebrow || DEFAULT_CONTENT.heroEyebrow).trim() || DEFAULT_CONTENT.heroEyebrow,
    heroTitle: String(payload.heroTitle || DEFAULT_CONTENT.heroTitle).trim() || DEFAULT_CONTENT.heroTitle,
    heroSummary: String(payload.heroSummary || DEFAULT_CONTENT.heroSummary).trim() || DEFAULT_CONTENT.heroSummary,
    introHtml: sanitizeHtml(String(payload.introHtml || DEFAULT_CONTENT.introHtml).trim() || DEFAULT_CONTENT.introHtml),
    detailHtml: sanitizeHtml(String(payload.detailHtml || DEFAULT_CONTENT.detailHtml).trim() || DEFAULT_CONTENT.detailHtml),
    ctaLabel: String(payload.ctaLabel || DEFAULT_CONTENT.ctaLabel).trim() || DEFAULT_CONTENT.ctaLabel,
    goalAmountCents: Math.max(100, Math.round(Number(payload.goalAmountCents) || DEFAULT_CONTENT.goalAmountCents)),
    donationPresets: presets,
    trustBadges: Array.isArray(payload.trustBadges) && payload.trustBadges.length > 0
      ? payload.trustBadges.map((value) => String(value).trim()).filter(Boolean).slice(0, 4)
      : DEFAULT_CONTENT.trustBadges,
    theme: normalizeTheme(payload.theme || DEFAULT_CONTENT.theme),
  };
}

export async function loadCampaignContent() {
  try {
    const raw = await fs.readFile(contentPath(), "utf8");
    const parsed = JSON.parse(raw) as SaveCampaignPayload;
    return normalizeCampaignContent(parsed);
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function saveCampaignContent(payload: SaveCampaignPayload) {
  const normalized = normalizeCampaignContent(payload);
  await fs.mkdir(path.dirname(contentPath()), { recursive: true });
  await fs.writeFile(contentPath(), JSON.stringify(normalized, null, 2));
  return normalized;
}

export function assertAdminAccess(token?: string | null) {
  const expected = process.env.ADMIN_ACCESS_TOKEN;
  if (!expected) {
    return;
  }
  if (!token || token !== expected) {
    throw new Error("ADMIN_ACCESS_TOKEN is invalid.");
  }
}

export function themeStyleVars(theme: CampaignTheme) {
  return {
    "--background": theme.background,
    "--foreground": theme.foreground,
    "--primary": theme.primary,
    "--secondary": theme.secondary,
    "--accent": theme.accent,
    "--muted": theme.muted,
    "--surface": theme.surface,
    "--border": theme.border,
  } as CSSProperties;
}

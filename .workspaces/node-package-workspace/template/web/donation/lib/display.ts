import type { CSSProperties } from "react";
import type { CampaignTheme } from "@/lib/campaign-content";

export function formatCurrency(amountCents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amountCents / 100);
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

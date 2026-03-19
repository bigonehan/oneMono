import { create } from "zustand";
import type { CampaignContent, CampaignTheme } from "@/lib/campaign-content";

type DonationAdminStore = {
  content: CampaignContent | null;
  hydrate: (content: CampaignContent) => void;
  setField: (
    key:
      | "campaignName"
      | "heroEyebrow"
      | "heroTitle"
      | "heroSummary"
      | "introHtml"
      | "detailHtml"
      | "ctaLabel"
      | "goalAmountCents",
    value: string | number,
  ) => void;
  setThemeField: (key: keyof CampaignTheme, value: string) => void;
  setTrustBadges: (value: string) => void;
};

export const useDonationAdminStore = create<DonationAdminStore>((set) => ({
  content: null,
  hydrate: (content) => set({ content }),
  setField: (key, value) =>
    set((state) => {
      if (!state.content) {
        return state;
      }
      return {
        content: {
          ...state.content,
          [key]: value,
        },
      };
    }),
  setThemeField: (key, value) =>
    set((state) => {
      if (!state.content) {
        return state;
      }
      return {
        content: {
          ...state.content,
          theme: {
            ...state.content.theme,
            [key]: value,
          },
        },
      };
    }),
  setTrustBadges: (value) =>
    set((state) => {
      if (!state.content) {
        return state;
      }
      return {
        content: {
          ...state.content,
          trustBadges: value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, 4),
        },
      };
    }),
}));

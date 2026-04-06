import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SiteConfig = {
  id: string;
  name: string;
  url: string;
  inputSelector: string;
  submitSelector: string;
  responseSelector: string;
};

type SiteConfigInput = Omit<SiteConfig, "id">;

type SiteConfigState = {
  sites: SiteConfig[];
  selectedSiteId: string;
  addSite: (site: SiteConfigInput) => void;
  removeSite: (siteId: string) => void;
  setSelectedSite: (siteId: string) => void;
};

const defaultSite: SiteConfig = {
  id: "chatgpt-default",
  name: "ChatGPT",
  url: "https://chatgpt.com",
  inputSelector: "#prompt-textarea",
  submitSelector: "button[data-testid='send-button']",
  responseSelector: "article[data-testid='conversation-turn']:last-of-type",
};

const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `site-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

const trimSite = (site: SiteConfigInput): SiteConfigInput => ({
  name: site.name.trim(),
  url: site.url.trim(),
  inputSelector: site.inputSelector.trim(),
  submitSelector: site.submitSelector.trim(),
  responseSelector: site.responseSelector.trim(),
});

const isFilled = (site: SiteConfigInput) =>
  site.name.length > 0 &&
  site.url.length > 0 &&
  site.inputSelector.length > 0 &&
  site.submitSelector.length > 0 &&
  site.responseSelector.length > 0;

export const useSiteConfigStore = create<SiteConfigState>()(
  persist(
    (set, get) => ({
      sites: [defaultSite],
      selectedSiteId: defaultSite.id,
      addSite: (rawSite) => {
        const site = trimSite(rawSite);
        if (!isFilled(site)) {
          return;
        }

        const id = createId();
        set((state) => ({
          sites: [...state.sites, { id, ...site }],
          selectedSiteId: state.selectedSiteId || id,
        }));
      },
      removeSite: (siteId) => {
        set((state) => {
          const nextSites = state.sites.filter((site) => site.id !== siteId);
          if (nextSites.length === 0) {
            return {
              sites: [defaultSite],
              selectedSiteId: defaultSite.id,
            };
          }

          const stillSelected = nextSites.some((site) => site.id === state.selectedSiteId);
          return {
            sites: nextSites,
            selectedSiteId: stillSelected ? state.selectedSiteId : nextSites[0].id,
          };
        });
      },
      setSelectedSite: (siteId) => {
        const found = get().sites.some((site) => site.id === siteId);
        if (!found) {
          return;
        }
        set({ selectedSiteId: siteId });
      },
    }),
    {
      name: "agent-site-config",
      version: 1,
    },
  ),
);

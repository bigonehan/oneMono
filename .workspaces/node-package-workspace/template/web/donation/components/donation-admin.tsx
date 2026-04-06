"use client";

import { ArticleEditor } from "@features/editor";
import { useEffect, useState } from "react";
import type { CampaignContent, CampaignTheme } from "@/lib/campaign-content";
import { themeStyleVars } from "@/lib/display";
import { useDonationAdminStore } from "@/store/donation-admin-store";

type DonationAdminProps = {
  initialContent: CampaignContent;
};

const THEME_FIELDS: Array<keyof CampaignTheme> = [
  "background",
  "foreground",
  "primary",
  "secondary",
  "accent",
  "muted",
  "surface",
  "border",
];

export function DonationAdmin({ initialContent }: DonationAdminProps) {
  const content = useDonationAdminStore((state) => state.content);
  const hydrate = useDonationAdminStore((state) => state.hydrate);
  const setField = useDonationAdminStore((state) => state.setField);
  const setThemeField = useDonationAdminStore((state) => state.setThemeField);
  const setTrustBadges = useDonationAdminStore((state) => state.setTrustBadges);

  const [adminToken, setAdminToken] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    hydrate(initialContent);
  }, [hydrate, initialContent]);

  if (!content) {
    return null;
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage("Saving campaign content...");

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...content,
          adminToken,
        }),
      });

      const data = (await response.json()) as CampaignContent & { error?: string };
      if (!response.ok) {
        setMessage(data.error || "Unable to save campaign content.");
        return;
      }

      hydrate(data);
      setMessage("Campaign content saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save campaign content.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="admin-shell">
      <section className="admin-panel" data-testid="admin-editor">
        <div className="admin-panel__header">
          <div>
            <p className="admin-eyebrow">Operator Console</p>
            <h1>Campaign editor</h1>
          </div>
          <button
            type="button"
            className="button button--secondary"
            onClick={() => void handleSave()}
            disabled={isSaving}
            data-testid="admin-save-button"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>

        <div className="admin-grid">
          <label className="field">
            <span>Admin token</span>
            <input
              data-testid="admin-token-input"
              type="password"
              placeholder="Optional unless ADMIN_ACCESS_TOKEN is set"
              value={adminToken}
              onChange={(event) => setAdminToken(event.target.value)}
            />
          </label>

          <label className="field">
            <span>Campaign name</span>
            <input
              value={content.campaignName}
              onChange={(event) => setField("campaignName", event.target.value)}
              data-testid="admin-campaign-name"
            />
          </label>

          <label className="field">
            <span>Eyebrow</span>
            <input
              value={content.heroEyebrow}
              onChange={(event) => setField("heroEyebrow", event.target.value)}
              data-testid="admin-hero-eyebrow"
            />
          </label>

          <label className="field">
            <span>Hero title</span>
            <input
              value={content.heroTitle}
              onChange={(event) => setField("heroTitle", event.target.value)}
              data-testid="admin-hero-title"
            />
          </label>

          <label className="field field--full">
            <span>Hero summary</span>
            <textarea value={content.heroSummary} onChange={(event) => setField("heroSummary", event.target.value)} />
          </label>

          <label className="field">
            <span>CTA label</span>
            <input value={content.ctaLabel} onChange={(event) => setField("ctaLabel", event.target.value)} />
          </label>

          <label className="field">
            <span>Goal amount (cents)</span>
            <input
              type="number"
              min="100"
              step="100"
              value={content.goalAmountCents}
              onChange={(event) => setField("goalAmountCents", Number(event.target.value))}
            />
          </label>

          <label className="field field--full">
            <span>Trust badges (comma separated)</span>
            <input
              value={content.trustBadges.join(", ")}
              onChange={(event) => setTrustBadges(event.target.value)}
            />
          </label>

          <div className="field field--full">
            <span>Intro copy</span>
            <div className="editor-shell">
              <ArticleEditor
                value={content.introHtml}
                placeholder="Write the opening story..."
                onChange={(value) => setField("introHtml", value)}
              />
            </div>
          </div>

          <div className="field field--full">
            <span>Detail copy</span>
            <div className="editor-shell">
              <ArticleEditor
                value={content.detailHtml}
                placeholder="Explain the impact and transparency model..."
                onChange={(value) => setField("detailHtml", value)}
              />
            </div>
          </div>

          {THEME_FIELDS.map((field) => (
            <label key={field} className="field">
              <span>{field}</span>
              <input
                type="color"
                value={content.theme[field]}
                onChange={(event) => setThemeField(field, event.target.value)}
              />
            </label>
          ))}
        </div>

        <p className="admin-message" data-testid="admin-save-message">{message}</p>
      </section>

      <section className="admin-preview" style={themeStyleVars(content.theme)}>
        <p className="admin-eyebrow">Live preview</p>
        <h2 data-testid="admin-preview-title">{content.heroTitle}</h2>
        <p>{content.heroSummary}</p>
        <div className="admin-preview__badges">
          {content.trustBadges.map((badge) => (
            <span key={badge} className="mini-badge">
              {badge}
            </span>
          ))}
        </div>
        <div className="admin-preview__cta">
          <button type="button" className="button button--primary">
            {content.ctaLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

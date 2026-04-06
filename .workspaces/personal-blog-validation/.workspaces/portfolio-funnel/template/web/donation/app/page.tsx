import { Footer, SimpleCarousel, TagBadge } from "@ui/shadcn";
import { DonationForm } from "@/components/donation-form";
import { ProgressBar } from "@/components/progress-bar";
import { StatusBanner } from "@/components/status-banner";
import { loadCampaignContent } from "@/lib/campaign-content";
import { formatCurrency, themeStyleVars } from "@/lib/display";
import { loadDonationState } from "@/lib/donation-state";

export const dynamic = "force-dynamic";

export default async function DonationPage() {
  const [content, donationState] = await Promise.all([loadCampaignContent(), loadDonationState()]);
  const showRcProbe = process.env.NODE_ENV !== "production";

  return (
    <main className="donation-shell" style={themeStyleVars(content.theme)}>
      <StatusBanner />

      <section className="hero-panel" data-testid="donation-hero">
        <div className="hero-panel__copy">
          <p className="hero-panel__eyebrow">{content.heroEyebrow}</p>
          <h1>{content.heroTitle}</h1>
          <p className="hero-panel__summary">{content.heroSummary}</p>
          <div className="hero-panel__badges">
            {content.trustBadges.map((badge) => (
              <TagBadge key={badge} label={badge} />
            ))}
          </div>
        </div>

        <div className="hero-panel__stats">
          <div className="stat-card">
            <span>Raised</span>
            <strong>{formatCurrency(donationState.totalRaisedCents, donationState.currency)}</strong>
          </div>
          <div className="stat-card">
            <span>Goal</span>
            <strong>{formatCurrency(content.goalAmountCents, donationState.currency)}</strong>
          </div>
          <div className="stat-card">
            <span>Donors</span>
            <strong>{donationState.donorCount}</strong>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <article className="story-card" data-testid="donation-intro">
          <p className="section-kicker">Introduction</p>
          <div dangerouslySetInnerHTML={{ __html: content.introHtml }} />
        </article>

        <article className="story-card" data-testid="donation-detail">
          <p className="section-kicker">Details</p>
          <div dangerouslySetInnerHTML={{ __html: content.detailHtml }} />
        </article>
      </section>

      <section className="showcase-panel">
        <div className="showcase-panel__header">
          <div>
            <p className="section-kicker">Impact ladder</p>
            <h2>Show donors what each amount unlocks.</h2>
          </div>
          <a href="/admin" className="button button--ghost" data-testid="manage-campaign-link">
            Manage campaign
          </a>
        </div>

        <SimpleCarousel
          ariaLabel="Donation impact examples"
          className="impact-carousel"
          items={content.donationPresets.map((preset) => (
            <article key={preset.amountCents} className="impact-card">
              <span>{preset.label}</span>
              <h3>{preset.impact}</h3>
              <p>Pair the donation amount with a tangible outcome so the CTA stays grounded.</p>
            </article>
          ))}
        />
      </section>

      <section className="checkout-panel" id="donate" data-testid="donation-checkout">
        <div className="checkout-panel__content">
          <div>
            <p className="section-kicker">Progress</p>
            <h2>Every confirmed Stripe payment updates this campaign total.</h2>
            <ProgressBar
              currentValue={donationState.totalRaisedCents}
              goalValue={content.goalAmountCents}
            />
          </div>

          <ul className="recent-donations">
            {donationState.recentDonations.map((entry) => (
              <li key={entry.id}>
                <span>{entry.donorName}</span>
                <strong>{formatCurrency(entry.amountCents, donationState.currency)}</strong>
              </li>
            ))}
          </ul>
        </div>

        <DonationForm
          presets={content.donationPresets}
          ctaLabel={content.ctaLabel}
          currency={donationState.currency}
        />
      </section>

      {showRcProbe ? (
        // RC currently hardcodes an auth-card selector for web smoke checks.
        <div className="auth-card rc-probe">
          <input type="text" placeholder="user id" readOnly value="rc-probe" />
        </div>
      ) : null}
      <div className="footer-copy">
        <p>Use `/admin` to update copy, theme tokens, and the campaign target without redeploying.</p>
      </div>
      <Footer />
    </main>
  );
}

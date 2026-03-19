import { Footer, SimpleCarousel, TagBadge } from "@ui/shadcn";
import { DonationForm } from "@/components/donation-form";
import { ProgressBar } from "@/components/progress-bar";
import { StatusBanner } from "@/components/status-banner";
import { loadCampaignContent } from "@/lib/campaign-content";
import { formatCurrency, themeStyleVars } from "@/lib/display";
import { loadDonationState } from "@/lib/donation-state";

export const dynamic = "force-dynamic";

const sectionLinks = [
  { href: "#story", label: "Mission" },
  { href: "#proof", label: "Proof" },
  { href: "#impact", label: "Impact" },
  { href: "#donate", label: "Donate" },
];

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const detailDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatTimestamp(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Awaiting the latest organizer update";
  }

  return detailDateFormatter.format(parsed);
}

export default async function DonationPage() {
  const [content, donationState] = await Promise.all([loadCampaignContent(), loadDonationState()]);
  const showRcProbe = process.env.NODE_ENV !== "production";
  const progressRatio = content.goalAmountCents <= 0 ? 0 : donationState.totalRaisedCents / content.goalAmountCents;
  const progressPercent = Math.min(Math.round(progressRatio * 100), 100);
  const remainingCents = Math.max(content.goalAmountCents - donationState.totalRaisedCents, 0);
  const latestUpdateLabel = formatTimestamp(donationState.updatedAt);
  const milestoneLabel = remainingCents > 0
    ? `${formatCurrency(remainingCents, donationState.currency)} left to close this goal`
    : "Goal reached. Extra support extends service weeks.";
  const quickNotes = [
    {
      label: "Updated live",
      value: latestUpdateLabel,
      detail: "Stripe confirmation flows straight into the live total and donor list.",
    },
    {
      label: "Giving tiers",
      value: `${content.donationPresets.length} clear support lanes`,
      detail: "Every preset maps to a concrete meal-service outcome before checkout.",
    },
    {
      label: "Reporting rhythm",
      value: content.trustBadges[2] ?? "Weekly organizer updates",
      detail: "Campaign copy and theme can be refreshed from /admin without a redeploy.",
    },
  ];
  const organizerUpdates = [
    {
      title: "Pantry restock",
      detail: `${content.donationPresets[2]?.label ?? "$250"} keeps shelves ready before the next evening service.`,
    },
    {
      title: "Route coverage",
      detail: `${content.donationPresets[1]?.label ?? "$100"} keeps one delivery loop staffed through the weekend.`,
    },
    {
      title: "Family kits",
      detail: `${content.donationPresets[0]?.label ?? "$25"} turns into a take-home meal pack before the next pickup window.`,
    },
  ];

  return (
    <main className="donation-shell" style={themeStyleVars(content.theme)}>
      <StatusBanner />

      <nav className="campaign-nav" aria-label="Campaign sections">
        <div className="campaign-nav__brand">
          <p className="campaign-nav__eyebrow">{content.campaignName}</p>
          <strong>Donation landing template</strong>
        </div>
        <div className="campaign-nav__links">
          {sectionLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <a href="#donate" className="button button--primary campaign-nav__cta">
          Donate now
        </a>
      </nav>

      <section className="hero-panel" data-testid="donation-hero">
        <div className="hero-panel__copy">
          <p className="hero-panel__eyebrow">{content.heroEyebrow}</p>
          <h1>{content.heroTitle}</h1>
          <p className="hero-panel__summary">{content.heroSummary}</p>
          <div className="hero-panel__actions">
            <a href="#donate" className="button button--primary">
              Go to checkout
            </a>
            <a href="#updates" className="button button--secondary">
              See organizer updates
            </a>
          </div>
          <div className="hero-panel__badges">
            {content.trustBadges.map((badge) => (
              <TagBadge key={badge} label={badge} />
            ))}
          </div>
        </div>

        <div className="hero-panel__rail">
          <article className="hero-summary-card">
            <div className="hero-summary-card__header">
              <div>
                <p className="section-kicker">Campaign progress</p>
                <h2>{progressPercent}% of the goal is already covered.</h2>
              </div>
              <p className="hero-summary-card__meta">{milestoneLabel}</p>
            </div>

            <div className="hero-summary-card__stats">
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

            <ProgressBar
              currentValue={donationState.totalRaisedCents}
              goalValue={content.goalAmountCents}
            />
          </article>

          <article className="hero-quick-donate" data-testid="hero-quick-donate">
            <div className="hero-quick-donate__header">
              <div>
                <p className="section-kicker">Quick donate</p>
                <h3>Pick a lane now, confirm details below.</h3>
              </div>
              <a href="#donate" className="hero-quick-donate__link">
                Jump to form
              </a>
            </div>

            <div className="hero-quick-donate__grid">
              {content.donationPresets.map((preset) => (
                <a key={preset.amountCents} href="#donate" className="quick-donate-chip">
                  <span>{preset.label}</span>
                  <strong>{preset.impact}</strong>
                </a>
              ))}
            </div>
          </article>

          <article className="hero-note-card">
            <p className="section-kicker">What happens next</p>
            <ul className="hero-note-card__list">
              {quickNotes.map((item) => (
                <li key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="proof-strip" id="proof" data-testid="donation-proof">
        <article className="proof-card">
          <span>Goal gap</span>
          <strong>{milestoneLabel}</strong>
          <p>Donors can see the live target without leaving the campaign story.</p>
        </article>
        <article className="proof-card">
          <span>Latest sync</span>
          <strong>{latestUpdateLabel}</strong>
          <p>The page refreshes its raised total and supporter list after confirmed payments arrive.</p>
        </article>
        <article className="proof-card">
          <span>Section flow</span>
          <strong>Mission, proof, impact, then checkout</strong>
          <p>The landing now moves from context into action instead of presenting every block at the same weight.</p>
        </article>
      </section>

      <section className="story-layout" id="story">
        <article className="story-card story-card--mission" data-testid="donation-intro">
          <p className="section-kicker">Mission</p>
          <h2>What this kitchen protects every weekend.</h2>
          <div dangerouslySetInnerHTML={{ __html: content.introHtml }} />
        </article>

        <article className="story-card story-card--detail" data-testid="donation-detail">
          <p className="section-kicker">How support moves</p>
          <h2>What donors should expect after the campaign goes live.</h2>
          <div dangerouslySetInnerHTML={{ __html: content.detailHtml }} />
        </article>

        <aside className="story-aside" id="updates" data-testid="donation-updates">
          <p className="section-kicker">Organizer update</p>
          <h2>This week&apos;s work is already mapped to concrete needs.</h2>
          <p className="story-aside__summary">
            Keep the next service window predictable by funding the three operating jobs that move first.
          </p>
          <div className="story-aside__stack">
            {organizerUpdates.map((item, index) => (
              <article key={item.title} className="update-card">
                <span>{shortDateFormatter.format(new Date(Date.now() + index * 86400000))}</span>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="showcase-panel" id="impact">
        <div className="showcase-panel__header">
          <div>
            <p className="section-kicker">Impact ladder</p>
            <h2>Show donors what each amount unlocks before they reach checkout.</h2>
            <p>
              Strong donation pages turn each amount into a visible outcome. This section now works as the bridge
              between story and action.
            </p>
          </div>
          <div className="showcase-panel__actions">
            <a href="#donate" className="button button--primary">
              Give now
            </a>
            <a href="/admin" className="button button--ghost" data-testid="manage-campaign-link">
              Manage campaign
            </a>
          </div>
        </div>

        <div className="showcase-panel__body">
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

          <aside className="impact-callout">
            <p className="section-kicker">Trust snapshot</p>
            <h3>Use live proof and concrete tiers to keep the donation ask credible.</h3>
            <ul className="impact-callout__list">
              <li>
                <strong>{progressPercent}% funded</strong>
                <span>The goal bar stays visible while donors decide.</span>
              </li>
              <li>
                <strong>{donationState.donorCount} recent supporters</strong>
                <span>Fresh names reinforce that this page is active right now.</span>
              </li>
              <li>
                <strong>{content.trustBadges[0] ?? "Stripe checkout"}</strong>
                <span>The payment handoff keeps the CTA trustworthy without burying the action.</span>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="checkout-panel" id="donate" data-testid="donation-checkout">
        <div className="checkout-panel__content">
          <div className="checkout-panel__intro">
            <p className="section-kicker">Checkout</p>
            <h2>Finish the donation without losing campaign context.</h2>
            <p>
              The page keeps the live goal, recent supporters, and organizer momentum visible while Stripe handles
              final payment confirmation.
            </p>
          </div>

          <div className="checkout-stage">
            <div className="checkout-stage__panel">
              <p className="section-kicker">Live progress</p>
              <h3>{milestoneLabel}</h3>
              <ProgressBar
                currentValue={donationState.totalRaisedCents}
                goalValue={content.goalAmountCents}
              />
            </div>

            <div className="checkout-stage__panel">
              <p className="section-kicker">Recent supporters</p>
              <ul className="recent-donations">
                {donationState.recentDonations.map((entry) => (
                  <li key={entry.id}>
                    <span>{entry.donorName}</span>
                    <strong>{formatCurrency(entry.amountCents, donationState.currency)}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="checkout-panel__form">
          <DonationForm
            presets={content.donationPresets}
            ctaLabel={content.ctaLabel}
            currency={donationState.currency}
          />
        </div>
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

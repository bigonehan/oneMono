const sections = [
  {
    eyebrow: "Section 01",
    title: "Launch",
    copy: "A full-screen opening panel with enough contrast and movement to make the first scroll feel intentional.",
    tags: ["Hero", "Scroll snap", "Intro"],
  },
  {
    eyebrow: "Section 02",
    title: "Flow",
    copy: "Alternating alignment gives each viewport a clear rhythm while keeping the markup compact and reusable.",
    tags: ["Responsive", "Balanced", "Fluid"],
  },
  {
    eyebrow: "Section 03",
    title: "Signal",
    copy: "Large type, restrained copy, and animated blocks make this template useful for product, portfolio, or campaign starts.",
    tags: ["Editorial", "Motion", "Focus"],
  },
  {
    eyebrow: "Section 04",
    title: "Build",
    copy: "The page uses plain CSS motion, so it stays easy to customize before adding heavier animation libraries.",
    tags: ["CSS", "No runtime", "Composable"],
  },
  {
    eyebrow: "Section 05",
    title: "Ship",
    copy: "The final panel closes the sequence cleanly and leaves space for a conversion action or next route.",
    tags: ["Finale", "CTA ready", "Next.js"],
  },
];

export default function Page() {
  return (
    <main className="motion-page" aria-label="Five fullscreen motion sections">
      {sections.map((section) => (
        <section className="section" key={section.eyebrow}>
          <div className="section__orb" aria-hidden="true" />
          <div
            className="section__orb section__orb--secondary"
            aria-hidden="true"
          />
          <div className="section__content">
            <p className="section__eyebrow">{section.eyebrow}</p>
            <h1 className="section__title">{section.title}</h1>
            <p className="section__copy">{section.copy}</p>
            <div className="section__meta" aria-label={`${section.title} tags`}>
              {section.tags.map((tag) => (
                <span className="section__pill" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}

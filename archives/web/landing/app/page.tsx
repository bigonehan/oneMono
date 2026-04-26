import { HelloPanel } from "@/components/hello-panel";

const featureCards = [
  {
    title: "Clear first-fold CTA",
    body: "Put the product promise, target persona, and action button in one view instead of hiding the shape of the template behind a single card.",
  },
  {
    title: "Section rhythm",
    body: "Move from positioning to workflow to proof so the page reads like a launch starter, not a placeholder shell.",
  },
  {
    title: "Built-in interaction",
    body: "Keep one live Zustand interaction visible so the template proves state handling while still looking like a presentable marketing page.",
  },
];

const workflowSteps = [
  "Start with the hero promise and collect intent above the fold.",
  "Use reusable sections to explain offer, workflow, and proof without rethinking spacing every time.",
  "Drop in your own brand copy while keeping the interaction module as a lightweight demo state.",
];

const proofCards = [
  "Hero, features, workflow, proof, and closing CTA are separated into dedicated bands.",
  "The right rail keeps a live interaction demo so the template does not regress into static mockup-only UI.",
  "Every section is sized to read as a landing page block, not a loose set of unrelated cards.",
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-white/10 bg-black/20 px-5 py-3 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-200/80">Template / Landing</p>
            <strong className="text-lg font-semibold text-white">Starter site with real section structure</strong>
          </div>
          <nav className="flex flex-wrap items-center gap-2 text-sm text-white/75">
            <a className="rounded-full border border-white/10 px-4 py-2 hover:bg-white/5" href="#features">
              Features
            </a>
            <a className="rounded-full border border-white/10 px-4 py-2 hover:bg-white/5" href="#workflow">
              Workflow
            </a>
            <a className="rounded-full border border-white/10 px-4 py-2 hover:bg-white/5" href="#proof">
              Proof
            </a>
          </nav>
        </header>

        <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-[#1b1320]/85 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.32)] lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
          <div className="flex flex-col gap-8">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-200/80">
                Section-ready starter
              </p>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Turn the bare landing template into a page that actually explains itself.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/72">
                The template now opens with a product promise, follows with reusable explanation bands, and keeps
                a live interaction panel visible so the page feels ready to customize instead of unfinished.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#features"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-amber-300 px-6 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
              >
                Explore sections
              </a>
              <a
                href="#proof"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                See proof
              </a>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {featureCards.map((card) => (
                <article key={card.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <h2 className="text-lg font-semibold text-white">{card.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-white/68">{card.body}</p>
                </article>
              ))}
            </div>
          </div>

          <HelloPanel />
        </section>

        <section
          id="features"
          className="grid gap-5 rounded-[2rem] border border-black/5 bg-[#f8f3eb] p-8 text-slate-950 shadow-[0_20px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[0.8fr_1.2fr]"
        >
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Features</p>
            <h2 className="text-3xl font-semibold tracking-tight">Each band has a job now.</h2>
            <p className="text-base leading-7 text-slate-600">
              The landing is organized so copy, proof, workflow, and CTA do not compete for the same visual weight.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Hero</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Promise, summary, and CTA are grouped so the first fold answers what this template is for.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Explainers</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Feature and workflow sections carry the middle of the page instead of repeating generic filler blocks.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Proof</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                A dedicated trust band explains why the structure is usable for a real launch page.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Interaction</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                The Zustand module stays visible so stateful UI does not disappear once the layout improves.
              </p>
            </article>
          </div>
        </section>

        <section id="workflow" className="grid gap-5 rounded-[2rem] border border-white/10 bg-black/20 p-8 md:grid-cols-3">
          {workflowSteps.map((step, index) => (
            <article key={step} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-200/75">
                Step 0{index + 1}
              </span>
              <p className="mt-4 text-base leading-7 text-white/72">{step}</p>
            </article>
          ))}
        </section>

        <section
          id="proof"
          className="grid gap-5 rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,224,188,0.18),rgba(255,255,255,0.05))] p-8 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-200/80">Proof</p>
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              The template reads like a product page, not a hello-world checkpoint.
            </h2>
            <p className="text-base leading-7 text-white/70">
              This is the threshold the other web templates should meet as well: section intent is obvious before the
              user inspects the code.
            </p>
          </div>

          <div className="grid gap-4">
            {proofCards.map((item) => (
              <article key={item} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
                <p className="text-base leading-7 text-white/74">{item}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

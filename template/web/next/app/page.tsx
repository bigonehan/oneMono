import { Label, Test } from "@ui/shadcn";

export default function Home() {
  return (
    <main className="page">
      <h1>Monorepo Next App Template</h1>
      <p>UI components are imported from @ui/shadcn.</p>

      <section className="card">
        <Label htmlFor="template-input">Template Input</Label>
        <input id="template-input" className="input" placeholder="Type here" />
      </section>

      <Test />
    </main>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useHelloStore } from "@/store/hello-store";

export function HelloPanel() {
  const count = useHelloStore((state) => state.count);
  const addCount = useHelloStore((state) => state.addCount);
  const resetCount = useHelloStore((state) => state.resetCount);

  return (
    <section className="grid gap-6 rounded-[1.75rem] border border-white/10 bg-[#f8f5ef] p-6 text-slate-950 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Live interaction panel
        </p>
        <h2 className="text-3xl font-semibold tracking-tight">
          Interested launch teams
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Keep one small stateful module inside the landing so the template proves it can handle
          interaction, not only static sections.
        </p>
      </div>

      <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
        <span className="text-xs uppercase tracking-[0.3em] text-white/55">
          Current momentum
        </span>
        <div className="mt-4 flex items-end justify-between gap-4">
          <strong className="text-6xl font-semibold tracking-tight">
            {String(count).padStart(2, "0")}
          </strong>
          <p className="max-w-[12rem] text-sm leading-6 text-white/65">
            teams have asked to reuse this structure for a real launch page.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={addCount}>Add another team</Button>
        <Button onClick={resetCount} variant="secondary">
          Reset signal
        </Button>
      </div>
    </section>
  );
}

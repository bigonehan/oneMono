"use client";

import { Button } from "@/components/ui/button";
import { useHelloStore } from "@/store/hello-store";

export function HelloPanel() {
  const count = useHelloStore((state) => state.count);
  const addCount = useHelloStore((state) => state.addCount);
  const resetCount = useHelloStore((state) => state.resetCount);

  return (
    <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur">
      <h1 className="text-4xl font-semibold tracking-tight text-white">
        hello world
      </h1>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={addCount}>hello world {count}</Button>
        <Button onClick={resetCount} variant="secondary">
          reset
        </Button>
      </div>
    </section>
  );
}

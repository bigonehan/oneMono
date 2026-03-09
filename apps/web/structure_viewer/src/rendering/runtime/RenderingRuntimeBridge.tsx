import { useEffect, useRef, useState } from "react";
import { createPixiRuntime } from "./pixiRuntime";
import { R3FViewport } from "./R3FViewport";
import type { PixiRuntime } from "./pixiRuntime";
import type { RenderingRuntimeConfig, RuntimeSelectionState } from "./types";

type Props = {
  config: RenderingRuntimeConfig;
  selection: RuntimeSelectionState;
};

export function RenderingRuntimeBridge({ config, selection }: Props) {
  const pixiMountRef = useRef<HTMLDivElement | null>(null);
  const pixiRuntimeRef = useRef<PixiRuntime | null>(null);
  const [pixiError, setPixiError] = useState<string | null>(null);

  useEffect(() => {
    if (!config.enablePixi || !pixiMountRef.current) {
      return;
    }

    let cancelled = false;
    createPixiRuntime(pixiMountRef.current)
      .then((value) => {
        if (cancelled) {
          value.destroy();
          return;
        }
        pixiRuntimeRef.current = value;
        pixiRuntimeRef.current.syncSelection(selection);
      })
      .catch((error: unknown) => {
        setPixiError(error instanceof Error ? error.message : "pixi_init_failed");
      });

    return () => {
      cancelled = true;
      pixiRuntimeRef.current?.destroy();
      pixiRuntimeRef.current = null;
    };
  }, [config.enablePixi]);

  useEffect(() => {
    pixiRuntimeRef.current?.syncSelection(selection);
  }, [config.enablePixi, selection]);

  return (
    <section>
      {config.enablePixi ? (
        <div
          ref={pixiMountRef}
          style={{ minHeight: 180, border: "1px solid #334155", borderRadius: 8 }}
        />
      ) : null}
      {pixiError ? <p>Pixi runtime disabled: {pixiError}</p> : null}

      {config.enableR3f ? <R3FViewport selection={selection} /> : null}
    </section>
  );
}

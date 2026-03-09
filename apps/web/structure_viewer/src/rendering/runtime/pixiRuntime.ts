import { Application, Container, Graphics, Text } from "pixi.js";
import type { RuntimeSelectionState } from "./types";

export type PixiRuntime = {
  app: Application;
  syncSelection: (selection: RuntimeSelectionState) => void;
  destroy: () => void;
};

export const createPixiRuntime = async (
  mount: HTMLElement,
): Promise<PixiRuntime> => {
  const app = new Application();
  await app.init({ resizeTo: mount, background: "#0f172a" });
  mount.appendChild(app.canvas);

  const layer = new Container();
  const card = new Graphics().roundRect(16, 16, 280, 120, 10).fill("#1e293b");
  const title = new Text({
    text: "Renderer: PixiJS",
    style: { fill: "#e2e8f0", fontSize: 16 },
  });
  title.position.set(28, 34);

  const selectionText = new Text({
    text: "module: none",
    style: { fill: "#93c5fd", fontSize: 13 },
  });
  selectionText.position.set(28, 66);

  layer.addChild(card);
  layer.addChild(title);
  layer.addChild(selectionText);
  app.stage.addChild(layer);

  return {
    app,
    syncSelection: (selection) => {
      selectionText.text = `module: ${selection.selectedModuleId ?? "none"}`;
    },
    destroy: () => {
      app.destroy(true, { children: true });
    },
  };
};

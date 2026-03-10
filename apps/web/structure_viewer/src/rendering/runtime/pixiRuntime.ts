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
  const card = new Graphics().roundRect(16, 16, 320, 180, 12).fill("#1e293b");
  const title = new Text({
    text: "Module: none",
    style: { fill: "#e2e8f0", fontSize: 16 },
  });
  title.position.set(28, 34);

  const functionList = new Text({
    text: "Functions:\n- none",
    style: { fill: "#93c5fd", fontSize: 13, lineHeight: 18 },
  });
  functionList.position.set(28, 68);

  layer.addChild(card);
  layer.addChild(title);
  layer.addChild(functionList);
  app.stage.addChild(layer);

  return {
    app,
    syncSelection: (selection) => {
      title.text = `Module: ${selection.selectedModuleName ?? "none"}`;
      const lines = selection.functionEntries.slice(0, 6).map((item) => `- ${item.name}`);
      functionList.text = `Functions:\n${lines.length > 0 ? lines.join("\n") : "- none"}`;
    },
    destroy: () => {
      app.destroy(true, { children: true });
    },
  };
};

// @ts-check

import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        // tsconfig의 alias를 Vite에도 동일하게 알려줘야 함
        "@": path.resolve("./src"),
        "@ui/shadcn/components": path.resolve(
          "../../../packages/ui/shadcn/components",
        ),
        "@ui/shadcn/globals.css": path.resolve(
          "../../../packages/ui/shadcn/styles/globals.css",
        ),
        "@ui": path.resolve("../../../packages/ui"),
        "@ui/shadcn": path.resolve("../../../packages/ui/shadcn"),
      },
    },
    server: {
      fs: {
        // 모노레포 상위 폴더 접근 허용
        allow: [".."],
      },
    },
  },
});

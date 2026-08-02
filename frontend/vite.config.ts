import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/deferred-actions-panel.ts"),
      formats: ["es"],
      fileName: () => "deferred-actions-panel.js",
    },
    outDir: "../custom_components/deferred_actions/frontend",
    emptyOutDir: true,
    sourcemap: false,
    minify: "esbuild",
  },
});

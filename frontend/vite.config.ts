import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [{
    name: "escape-trailing-tabs",
    generateBundle(_options, bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type === "chunk") output.code = output.code.replace(/\t(?=\r?\n)/g, "\\t");
      }
    },
  }],
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

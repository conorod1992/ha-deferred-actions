import { readFileSync } from "node:fs";

const files = [
  "src/deferred-actions-panel.ts",
  "src/timezone.ts",
  "src/timezone.test.ts",
  "src/service-selectors.ts",
  "src/service-selectors.test.ts",
  "../custom_components/deferred_actions/frontend/deferred-actions-panel.js",
];

for (const path of files) {
  const encoded = readFileSync(path).toString("base64");
  const chunkSize = 3000;
  const chunks = Math.ceil(encoded.length / chunkSize);
  console.log(`PR9_BEGIN:${path}:${chunks}`);
  for (let index = 0; index < chunks; index += 1) {
    console.log(`PR9_CHUNK:${path}:${index + 1}:${encoded.slice(index * chunkSize, (index + 1) * chunkSize)}`);
  }
  console.log(`PR9_END:${path}`);
}

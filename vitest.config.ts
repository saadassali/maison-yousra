import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // « server-only » lève une erreur hors de Next : dans les tests, un module vide.
    alias: { "server-only": new URL("./tests/server-only-vide.ts", import.meta.url).pathname },
  },
  // Vercel lance le build avec NODE_ENV=production : les tests (prebuild) doivent rester en mode test.
  test: { environment: "node", env: { NODE_ENV: "test" } },
});

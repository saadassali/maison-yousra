import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // « server-only » lève une erreur hors de Next : dans les tests, un module vide.
    alias: { "server-only": new URL("./tests/server-only-vide.ts", import.meta.url).pathname },
  },
  test: { environment: "node" },
});

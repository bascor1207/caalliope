import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    // next-intl est en ESM sans extensions : on le laisse passer par Vite plutôt que par Node.
    server: { deps: { inline: ["next-intl"] } },
  },
});

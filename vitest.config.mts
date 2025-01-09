import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["node_modules"],
    alias: {
      "~": resolve(__dirname, "src"),
    },
  },
});

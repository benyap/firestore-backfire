import { describe, expect, test } from "vitest";

import {
  ensureDependencyInstalled,
  isDependencyInstalled,
  MissingPeerDependencyError,
} from "~/utils/dependency";

describe(ensureDependencyInstalled.name, () => {
  test("resolves when dependency is installed", async () => {
    await expect(ensureDependencyInstalled("vitest")).resolves.toBeUndefined();
  });

  test("rejects when dependency is not installed", async () => {
    await expect(ensureDependencyInstalled("?")).rejects.toThrow(
      MissingPeerDependencyError
    );
  });
});

describe(isDependencyInstalled.name, () => {
  test("returns `true` when dependency is installed", async () => {
    await expect(isDependencyInstalled("vitest")).resolves.toBe(true);
  });

  test("returns `false` when dependency is not installed", async () => {
    await expect(isDependencyInstalled("?")).resolves.toBe(false);
  });
});

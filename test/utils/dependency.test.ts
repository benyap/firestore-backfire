import { describe, expect, test } from "vitest";

import {
  ensureDependencyInstalled,
  isDependencyInstalled,
  MissingPeerDependencyError,
} from "~/utils/dependency";

describe(ensureDependencyInstalled.name, () => {
  test("resolves when dependency is installed", () => {
    expect(ensureDependencyInstalled("vitest")).toBeUndefined();
  });

  test("rejects when dependency is not installed", () => {
    expect(() => ensureDependencyInstalled("?")).toThrow(
      MissingPeerDependencyError
    );
  });
});

describe(isDependencyInstalled.name, () => {
  test("returns `true` when dependency is installed", () => {
    expect(isDependencyInstalled("vitest")).toBe(true);
  });

  test("returns `false` when dependency is not installed", () => {
    expect(isDependencyInstalled("?")).toBe(false);
  });
});

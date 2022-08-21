import { describe, test, expect } from "vitest";

import { split } from "~/utils/split";

describe(split.name, () => {
  test("returns empty list when input list is empty", () => {
    expect(split([], () => true)).toEqual([[], []]);
  });

  test("splits list according to predicate correctly", () => {
    expect(
      split(["ace", "bat", "cat", "art", "", "cat"], (x) => x.startsWith("a"))
    ).toEqual([
      ["ace", "art"],
      ["bat", "cat", "", "cat"],
    ]);
  });
});

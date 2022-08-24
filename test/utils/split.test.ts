import { describe, test, expect } from "vitest";

import { split, splitStrict } from "~/utils/split";

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

describe(splitStrict.name, () => {
  test("returns empty list when input list is empty", () => {
    expect(splitStrict([], (x): x is never => true)).toEqual([[], []]);
  });

  test("splits list according to predicate correctly", () => {
    expect(
      splitStrict(
        ["ace", "bat", "cat", 1, 2, "three"],
        (x): x is string => typeof x === "string"
      )
    ).toEqual([
      ["ace", "bat", "cat", "three"],
      [1, 2],
    ]);
  });
});

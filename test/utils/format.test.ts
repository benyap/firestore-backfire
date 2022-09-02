import { describe, expect, test } from "vitest";
import { yellow } from "ansi-colors";

import { capitalize, count, formatDuration, plural } from "~/utils/format";
import { TrackableList, TrackableNumber, Tracker } from "~/utils/track";

describe(capitalize.name, () => {
  test("capitalizes a message correctly", () => {
    expect(capitalize("hello")).toEqual("Hello");
    expect(capitalize("hello there")).toEqual("Hello there");
    expect(capitalize("Already capitalised")).toEqual("Already capitalised");
  });

  test("does not modify an empty string", () => {
    expect(capitalize("")).toEqual("");
  });
});

describe(count.name, () => {
  test("prints count correctly when value is a number", () => {
    expect(count(10)).toEqual(yellow("10"));
  });

  test("prints count correctly when value is a string", () => {
    expect(count("4")).toEqual(yellow("4"));
  });

  test("prints count correctly when value is an array", () => {
    expect(count([1, 2, 3])).toEqual(yellow("3"));
  });

  test("prints count correctly when value is a `TrackableNumber`", () => {
    const number = new TrackableNumber(new Tracker());
    number.increment(4);
    expect(count(number)).toEqual(yellow("4"));
  });

  test("prints count correctly when value is a `TrackableList`", () => {
    const list = new TrackableList(new Tracker());
    list.push(1, 2, 3);
    expect(count(list)).toEqual(yellow("3"));
  });
});

describe(plural.name, () => {
  test("returns plural when number = 0", () => {
    expect(plural(0, "thing")).toBe(`${yellow("0")} things`);
  });

  test("returns singular when number = 1", () => {
    expect(plural(1, "thing")).toBe(`${yellow("1")} thing`);
  });

  test("returns plural when number > 1", () => {
    expect(plural(4, "glass", "glasses")).toBe(`${yellow("4")} glasses`);
  });
});

describe(formatDuration.name, () => {
  const secs = 1000;
  const mins = 60 * secs;
  const hrs = 60 * mins;

  test("prints out durations < 1s correctly", () => {
    expect(formatDuration(10)).toEqual("10ms");
  });

  test("prints out durations < 1m correctly", () => {
    expect(formatDuration(12 * secs)).toEqual("12s");
    expect(formatDuration(12 * secs + 12)).toEqual("12.012s");
    expect(formatDuration(12 * secs + 123)).toEqual("12.123s");
  });

  test("prints out durations < 1h correctly", () => {
    expect(formatDuration(5 * mins)).toEqual("5m 00s");
    expect(formatDuration(5 * mins + 12 * secs + 123)).toEqual("5m 12s");
  });

  test("prints out durations > 1h correctly", () => {
    expect(formatDuration(2 * hrs)).toEqual("2h 00m");
    expect(formatDuration(2 * hrs + 12 * mins)).toEqual("2h 12m");
    expect(formatDuration(2 * hrs + 7 * mins + 4 * secs)).toEqual("2h 07m");
    expect(formatDuration(12 * hrs + 44 * secs + 12)).toEqual("12h 00m");
  });
});

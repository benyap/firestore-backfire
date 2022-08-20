import { describe, expect, test } from "vitest";
import { InvalidArgumentError } from "commander";

import { CliParser } from "~/utils/cli-parser";

describe(CliParser.name, () => {
  describe(CliParser.integer.name, () => {
    test("parses integer value", () => {
      expect(CliParser.integer()("10")).toBe(10);
    });

    test("parses float value", () => {
      expect(CliParser.integer()("10.5")).toBe(10);
      expect(CliParser.integer()("9.09")).toBe(9);
    });

    test("parses integer value between min and max", () => {
      expect(CliParser.integer({ min: 0, max: 100 })("10")).toBe(10);
    });

    test("parses integer value equal to min", () => {
      expect(CliParser.integer({ min: 0 })("0")).toBe(0);
    });

    test("parses integer value equal to max", () => {
      expect(CliParser.integer({ max: 10 })("10")).toBe(10);
    });

    test("throws error if value is not an integer", () => {
      expect(() => CliParser.integer()("")).toThrow(InvalidArgumentError);
      expect(() => CliParser.integer()("one")).toThrow(InvalidArgumentError);
    });

    test("throws error if value is less than min", () => {
      expect(() => CliParser.integer({ min: 0 })("-10")).toThrow(
        InvalidArgumentError
      );
    });

    test("throws error if value is greater than max", () => {
      expect(() => CliParser.integer({ max: 10 })("20")).toThrow(
        InvalidArgumentError
      );
    });
  });
});

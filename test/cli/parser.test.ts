import { describe, expect, test } from "vitest";
import { InvalidArgumentError } from "commander";

import { Parser } from "~/cli/parser";

describe(Parser.name, () => {
  describe(Parser.integer.name, () => {
    test("parses integer value", () => {
      expect(Parser.integer()("10")).toBe(10);
    });

    test("parses float value", () => {
      expect(Parser.integer()("10.5")).toBe(10);
      expect(Parser.integer()("9.09")).toBe(9);
    });

    test("parses integer value between min and max", () => {
      expect(Parser.integer({ min: 0, max: 100 })("10")).toBe(10);
    });

    test("parses integer value equal to min", () => {
      expect(Parser.integer({ min: 0 })("0")).toBe(0);
    });

    test("parses integer value equal to max", () => {
      expect(Parser.integer({ max: 10 })("10")).toBe(10);
    });

    test("throws error if value is not an integer", () => {
      expect(() => Parser.integer()("")).toThrow(InvalidArgumentError);
      expect(() => Parser.integer()("one")).toThrow(InvalidArgumentError);
    });

    test("throws error if value is less than min", () => {
      expect(() => Parser.integer({ min: 0 })("-10")).toThrow(
        InvalidArgumentError
      );
    });

    test("throws error if value is greater than max", () => {
      expect(() => Parser.integer({ max: 10 })("20")).toThrow(
        InvalidArgumentError
      );
    });
  });

  describe(Parser.regexList.name, () => {
    test("parses a single regex", () => {
      expect(Parser.regexList()("[a]", undefined)).toEqual([/[a]/]);
    });

    test("parses multiple regexes", () => {
      expect(Parser.regexList()("^a.*$", [/hello/])).toEqual([
        /hello/,
        /^a.*$/,
      ]);
    });

    test("throws error when parsing invalid regex", () => {
      expect(() => Parser.regexList()("[\\]", undefined)).toThrow(SyntaxError);
    });
  });
});

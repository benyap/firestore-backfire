import { describe, expect, test } from "vitest";

import { NDJSON } from "~/utils/ndjson";

describe(NDJSON.name, () => {
  describe(NDJSON.stringify.name, () => {
    test("stringifies a list of objects", () => {
      const data = [
        1,
        { hello: "world" },
        [1, 2, 3],
        [1, { hello: "world" }],
        "hello",
        "there",
      ];
      expect(NDJSON.stringify(data)).toMatchSnapshot();
    });
  });

  describe(NDJSON.parse.name, () => {
    test("parses valid NDJSON correctly", () => {
      const data = `
        {"hello":"world","list":[1,2]}
        1
        [1,2]
        "hello"
        "world"
      `;
      expect(NDJSON.parse(data)).toMatchSnapshot();
    });

    test("throws error when parsing invalid NDJSON", () => {
      const data = `
        {"hello":"world","list":[1,2]}
        [1,2
        "hello"
      `;
      expect(() => NDJSON.parse(data)).toThrowErrorMatchingSnapshot();
    });

    test("skips invalid lines of JSON when options.safe is true", () => {
      const data = `
        {"hello":"world","list":[1,2]}
        [1,2
        "hello"
      `;
      expect(NDJSON.parse(data, { safe: true })).toMatchSnapshot();
    });
  });
});

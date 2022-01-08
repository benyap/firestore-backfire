import { JSONArrayParser } from "~/utils/json/JSONArrayParser";

describe(JSONArrayParser.name, () => {
  let parser: JSONArrayParser;

  beforeEach(() => {
    parser = new JSONArrayParser();
  });

  describe("isClosed()", () => {
    it("is not closed by default", () => {
      expect(parser.isClosed()).toBe(false);
    });

    it("is not clsoed when processing an incomplete array", () => {
      parser.process("[[]");
      expect(parser.isClosed()).toBe(false);
    });

    it("is closed when processing an empty array", () => {
      parser.process("[]");
      expect(parser.isClosed()).toBe(true);
    });

    it("is closed when processing an array with items", () => {
      parser.process(`[1, 2, 3, 4]`);
      expect(parser.isClosed()).toBe(true);
    });
  });

  describe("flushItems()", () => {
    it("flushes empty array when there are no parseable items", () => {
      parser.process(`[{"hello":"world"`);
      expect(parser.flushItems()).toMatchInlineSnapshot(`Array []`);
    });

    it("flushes parseable items when there are some parseable items", () => {
      parser.process(`[1, {"hello": "world"}, {"incomplete`);
      expect(parser.flushItems()).toMatchInlineSnapshot(`
        Array [
          1,
          Object {
            "hello": "world",
          },
        ]
      `);
    });

    it("flushes all parseable items when processing completed array", () => {
      parser.process(`[1, {"hello": "world"}, {"example": true}]`);
      expect(parser.flushItems()).toMatchInlineSnapshot(`
        Array [
          1,
          Object {
            "hello": "world",
          },
          Object {
            "example": true,
          },
        ]
      `);
    });

    it("flushes items correctly multiple times", () => {
      parser.process(`[1, 2`);
      expect(parser.flushItems()).toMatchInlineSnapshot(`
        Array [
          1,
        ]
      `);
      parser.process(`2, 3, 4`);
      expect(parser.flushItems()).toMatchInlineSnapshot(`
        Array [
          22,
          3,
        ]
      `);
      parser.process(`]`);
      expect(parser.flushItems()).toMatchInlineSnapshot(`
        Array [
          4,
        ]
      `);
    });
  });

  describe("process()", () => {
    it("can parse a partial array through multiple passes", () => {
      parser.process(`[
        { "id": 1,
      `);
      parser.process(`
                   "name": "Bob" },
        { "id": 2, "name": "Alice" }
      `);
      parser.process(`
        { "id": 
      `);
      expect(parser.flushItems()).toMatchInlineSnapshot(`
        Array [
          Object {
            "id": 1,
            "name": "Bob",
          },
        ]
      `);
    });

    it("can parse a partial array with some unparseable items", () => {
      parser.process(`[
        {"id": 1},
        ,
        {"id": 2}
        {"id": 3},
        {"id": 4}
      `);
      expect(parser.flushItems()).toMatchInlineSnapshot(`
        Array [
          Object {
            "id": 1,
          },
          null,
          null,
        ]
      `);
    });

    it("can parse an array with escaped characters", () => {
      parser.process(
        JSON.stringify([
          {
            blob: JSON.stringify({
              hello: "{world}",
              char: ["\\", "\"'", '{}[]""'],
            }),
          },
        ])
      );
      const items = parser.flushItems();
      expect(items).toMatchInlineSnapshot(`
        Array [
          Object {
            "blob": "{\\"hello\\":\\"{world}\\",\\"char\\":[\\"\\\\\\\\\\",\\"\\\\\\"'\\",\\"{}[]\\\\\\"\\\\\\"\\"]}",
          },
        ]
      `);
      const parsed = JSON.parse(items[0].blob);
      expect(parsed.char[0]).toBe("\\");
      expect(parsed.char[1]).toBe(`"'`);
      expect(parsed.char[2]).toBe(`{}[]""`);
    });

    it("throws an error when trying to process an array that is already closed", () => {
      parser.process(`[]`);
      expect(() => parser.process(`1`)).toThrowErrorMatchingInlineSnapshot(
        `"array is closed"`
      );
    });
  });
});

import { countUniqueFieldOccurrences, redactFields } from "~/utils/diagnostics";

describe(countUniqueFieldOccurrences.name, () => {
  it("counts field occurences correctly", () => {
    const objects = [
      { name: "alice" },
      { name: "alice" },
      { name: "bob" },
      { name: "jim" },
      { name: "jim" },
    ];
    const result = countUniqueFieldOccurrences(objects, "name");
    expect(result).toMatchInlineSnapshot(`
      Object {
        "alice": 2,
        "bob": 1,
        "jim": 2,
      }
    `);
  });
});

describe(redactFields.name, () => {
  it("redacts fields when it exists", () => {
    const object = { hello: "world", other: "field" };
    const redactedObject = redactFields(object, "hello");
    expect(redactedObject).toMatchInlineSnapshot(`
      Object {
        "hello": "<hidden>",
        "other": "field",
      }
    `);
  });

  it("does not modify object when field does not exist", () => {
    const object = { hello: "world" };
    const redactedObject = redactFields(object as any, "field");
    expect(redactedObject).toMatchInlineSnapshot(`
      Object {
        "hello": "world",
      }
    `);
  });
});

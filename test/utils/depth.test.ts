import { collectionPathDepth, documentPathDepth } from "~/utils/depth";

describe(collectionPathDepth.name, () => {
  it("returns root level depth correctly", () => {
    expect(collectionPathDepth("emails")).toMatchInlineSnapshot(`0`);
  });

  it("returns nested depth correctly", () => {
    expect(collectionPathDepth("emails/1/contents")).toMatchInlineSnapshot(`1`);
    expect(collectionPathDepth("emails/1/contents/a/parts")).toMatchInlineSnapshot(
      `2`
    );
  });

  it("throws an error when given document path", () => {
    expect(() => collectionPathDepth("emails/1")).toThrowErrorMatchingInlineSnapshot(
      `"collection paths must have an odd number of segments"`
    );
  });
});

describe(documentPathDepth.name, () => {
  it("returns root level depth correctly", () => {
    expect(documentPathDepth("emails/1")).toMatchInlineSnapshot(`0`);
  });

  it("returns nested depth correctly", () => {
    expect(documentPathDepth("emails/1/contents/1")).toMatchInlineSnapshot(`1`);
    expect(documentPathDepth("emails/1/contents/a/parts/0")).toMatchInlineSnapshot(
      `2`
    );
  });

  it("throws an error when given collection path", () => {
    expect(() => documentPathDepth("emails")).toThrowErrorMatchingInlineSnapshot(
      `"document paths must have an even number of segments"`
    );
  });
});

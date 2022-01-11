import {
  pathType,
  collectionPathDepth,
  documentPathDepth,
} from "~/utils/firestorePath";

describe(pathType.name, () => {
  it("returns collection for top level collection", () => {
    expect(pathType("documents")).toBe("collection");
  });

  it("returns collection for nested collection", () => {
    expect(pathType("documents/1/parts")).toBe("collection");
  });

  it("returns document for top level document", () => {
    expect(pathType("documents/1")).toBe("document");
  });

  it("returns document for nested document", () => {
    expect(pathType("documents/1/parts/a")).toBe("document");
  });
});

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

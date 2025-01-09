import { describe, test, expect } from "vitest";

import {
  isDocumentPath,
  collectionPathDepth,
  documentPathDepth,
} from "~/firestore/utils";

describe(isDocumentPath.name, () => {
  test("returns `false` for top level collection", () => {
    expect(isDocumentPath("documents")).toBe(false);
  });

  test("returns `false` for nested collection", () => {
    expect(isDocumentPath("documents/1/parts")).toBe(false);
  });

  test("returns `true` for top level document", () => {
    expect(isDocumentPath("documents/1")).toBe(true);
  });

  test("returns `true` for nested document", () => {
    expect(isDocumentPath("documents/1/parts/a")).toBe(true);
  });
});

describe(collectionPathDepth.name, () => {
  test("returns root level depth correctly", () => {
    expect(collectionPathDepth("emails")).toMatchInlineSnapshot(`0`);
  });

  test("returns nested depth correctly", () => {
    expect(collectionPathDepth("emails/1/contents")).toMatchInlineSnapshot(`1`);
    expect(
      collectionPathDepth("emails/1/contents/a/parts"),
    ).toMatchInlineSnapshot(`2`);
  });

  test("throws an error when given document path", () => {
    expect(() =>
      collectionPathDepth("emails/1"),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: collection paths must have an odd number of segments]`,
    );
  });
});

describe(documentPathDepth.name, () => {
  test("returns root level depth correctly", () => {
    expect(documentPathDepth("emails/1")).toMatchInlineSnapshot(`0`);
  });

  test("returns nested depth correctly", () => {
    expect(documentPathDepth("emails/1/contents/1")).toMatchInlineSnapshot(`1`);
    expect(
      documentPathDepth("emails/1/contents/a/parts/0"),
    ).toMatchInlineSnapshot(`2`);
  });

  test("throws an error when given collection path", () => {
    expect(() =>
      documentPathDepth("emails"),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: document paths must have an even number of segments]`,
    );
  });
});

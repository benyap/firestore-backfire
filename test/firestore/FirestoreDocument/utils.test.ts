import { describe, test, expect, beforeAll } from "vitest";
import { Firestore, GeoPoint, Timestamp } from "@google-cloud/firestore";

import {
  isFirestoreTimestamp,
  isFirestoreGeoPoint,
  isFirestoreDocumentReference,
  isFirestoreQuery,
} from "~/firestore/FirestoreDocument/utils";

describe(isFirestoreTimestamp.name, () => {
  test("returns `true` if the object is a timestamp", () => {
    const timestamp = Timestamp.fromDate(new Date());
    expect(isFirestoreTimestamp(timestamp)).toBe(true);
  });
});

describe(isFirestoreGeoPoint.name, () => {
  test("returns `true` if the object is a GeoPoint", () => {
    const object = new GeoPoint(0, 0);
    expect(isFirestoreGeoPoint(object)).toBe(true);
  });
});

describe(isFirestoreDocumentReference.name, () => {
  let firestore: Firestore;

  beforeAll(() => {
    firestore = new Firestore({ projectId: "demo" });
  });

  test("returns `true` if the object is a DocumentReference", () => {
    const object = firestore.doc("test/test");
    expect(isFirestoreDocumentReference(object)).toBe(true);
  });

  test("returns `false` if the object is a CollectionReference", () => {
    const object = firestore.collection("test");
    expect(isFirestoreDocumentReference(object)).toBe(false);
  });

  test("returns `false` if the object is a Query", () => {
    const object = firestore.collection("test").where("field", "==", 0);
    expect(isFirestoreDocumentReference(object)).toBe(false);
  });
});

describe(isFirestoreQuery.name, () => {
  let firestore: Firestore;

  beforeAll(() => {
    firestore = new Firestore({ projectId: "demo" });
  });

  test("returns `true` if the object is a Query", () => {
    const object = firestore.collection("test").where("field", "==", 0);
    expect(isFirestoreQuery(object)).toBe(true);
  });

  test("returns `true` if the object is a CollectionReference", () => {
    const object = firestore.collection("test");
    expect(isFirestoreQuery(object)).toBe(true);
  });

  test("returns `false` if the object is a DocumentReference", () => {
    const object = firestore.doc("test/test");
    expect(isFirestoreQuery(object)).toBe(false);
  });
});

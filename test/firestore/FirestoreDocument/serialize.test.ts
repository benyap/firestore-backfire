import { describe, test, expect, beforeAll } from "vitest";
import { Firestore, Timestamp, GeoPoint } from "@google-cloud/firestore";

import { serializeDocument } from "~/firestore/FirestoreDocument/serialize";

describe(serializeDocument.name, () => {
  let firestore: Firestore;

  beforeAll(() => {
    firestore = new Firestore({ projectId: "demo" });
  });

  test("serializes plain documents", () => {
    const doc = serializeDocument(
      "email/1",
      {
        from: "example@email.com",
        to: ["recipient1@email.com", "recipient2@email.com"],
        content: "Dear John,\n\nHello world!",
        attachments: 2,
        tags: { work: true, important: true },
      },
      2
    );
    expect(doc).toMatchSnapshot();
  });

  test("serializes documents with timestamps", () => {
    const doc = serializeDocument(
      "email/1",
      {
        from: "example@email.com",
        date: Timestamp.fromDate(new Date("2022-01-01")),
        tags: {
          created: Timestamp.fromDate(new Date("2022-01-01")),
          dates: [Timestamp.fromDate(new Date("2022-01-01"))],
        },
      },
      2
    );
    expect(doc).toMatchSnapshot();
  });

  test("serializes documents with geopoints", () => {
    const doc = serializeDocument(
      "email/1",
      {
        from: "example@email.com",
        location: new GeoPoint(10, 20),
        tags: {
          location: new GeoPoint(10, 20),
          list: [new GeoPoint(10, 20)],
        },
      },
      2
    );
    expect(doc).toMatchSnapshot();
  });

  test("serializes documents with document references", () => {
    const doc = serializeDocument(
      "email/1",
      {
        from: "example@email.com",
        parent: firestore.doc("email/parent"),
        references: [firestore.doc("email/parent")],
      },
      2
    );
    expect(doc).toMatchSnapshot();
  });

  test("serializes documents with collection references", () => {
    const doc = serializeDocument(
      "email/1",
      {
        from: "example@email.com",
        root: firestore.collection("email"),
        threads: [firestore.collection("email/1/threads")],
      },
      2
    );
    expect(doc).toMatchSnapshot();
  });

  test("serializes documents with queries", () => {
    const doc = serializeDocument(
      "email/1",
      {
        from: "example@email.com",
        threads: firestore
          .collection("email/1/threads")
          .where("field", "array-contains", [1, 2])
          .orderBy("date", "desc"),
      },
      2
    );
    expect(doc).toMatchSnapshot();
  });
});

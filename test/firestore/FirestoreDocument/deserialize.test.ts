import { describe, test, expect, beforeAll } from "vitest";
import { Firestore } from "@google-cloud/firestore";

import { deserializeDocument } from "~/firestore/FirestoreDocument/deserialize";
import {
  SerializedTimestamp,
  SerializedGeoPoint,
  SerializedQuery,
  SerializedDocumentReference,
} from "~/firestore/FirestoreDocument/types";

describe(deserializeDocument.name, () => {
  let firestore: Firestore;

  beforeAll(() => {
    firestore = new Firestore({ projectId: "demo" });
  });

  test("deserializes plain documents", () => {
    const data = deserializeDocument(
      {
        path: "documents/1",
        data: {
          from: "example@email.com",
          to: ["recipient1@email.com", "recipient2@email.com"],
          content: "Dear John,\nHello world!",
          attachments: 2,
          tags: { work: true, important: true },
        },
      },
      firestore,
    );
    expect(data).toMatchSnapshot();
  });

  test("deserializes documents with timestamps", () => {
    const seconds = new Date("2022-01-01").getTime() / 1000;
    const data = deserializeDocument(
      {
        path: "documents/1",
        data: {
          id: "1",
          date: {
            _seconds: seconds,
            _nanoseconds: 0,
          } satisfies SerializedTimestamp,
          nested: {
            dates: [
              {
                _seconds: seconds,
                _nanoseconds: 0,
              } satisfies SerializedTimestamp,
              {
                _seconds: seconds,
                _nanoseconds: 0,
              } satisfies SerializedTimestamp,
            ],
          },
        },
        timestamps: ["date", "nested.dates.0", "nested.dates.1"],
      },
      firestore,
    );
    expect(data).toMatchSnapshot();
    expect(data.data.date.toDate()).toMatchSnapshot();
  });

  test("deserializes documents with geopoints", () => {
    const data = deserializeDocument(
      {
        path: "documents/1",
        data: {
          id: "1",
          point: { _latitude: 10, _longitude: 20 } satisfies SerializedGeoPoint,
          nested: {
            places: [
              { _latitude: 11, _longitude: 20 } satisfies SerializedGeoPoint,
              { _latitude: 12, _longitude: 20 } satisfies SerializedGeoPoint,
            ],
          },
        },
        geopoints: ["point", "nested.places.0", "nested.places.1"],
      },
      firestore,
    );
    expect(data).toMatchSnapshot();
  });

  test("deserializes documents with document references", () => {
    const data = deserializeDocument(
      {
        path: "documents/1",
        data: {
          id: "1",
          reference: {
            _firestore: { projectId: "demo" },
            _path: { segments: ["documents", "2"] },
          } satisfies SerializedDocumentReference,
          references: [
            {
              _firestore: { projectId: "demo" },
              _path: { segments: ["documents", "2"] },
            } satisfies SerializedDocumentReference,
          ],
        },
        documents: ["reference", "references.0"],
      },
      firestore,
    );
    expect(data).toMatchSnapshot();
    const ref = firestore.doc("documents/2");
    expect(ref.isEqual(data.data.reference)).toBe(true);
    expect(ref.isEqual(data.data.references[0])).toBe(true);
  });

  test("deserializes documents with collection references", () => {
    const data = deserializeDocument(
      {
        path: "documents/1",
        data: {
          id: "1",
          reference: {
            _firestore: { projectId: "demo" },
            _queryOptions: {
              parentPath: { segments: [] },
              collectionId: "documents",
              filters: [],
              fieldOrders: [],
            },
          } satisfies SerializedQuery,
          references: [
            {
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: [] },
                collectionId: "documents",
                filters: [],
                fieldOrders: [],
              },
            } satisfies SerializedQuery,
          ],
        },
        queries: ["reference", "references.0"],
      },
      firestore,
    );
    expect(data).toMatchSnapshot();
    const ref = firestore.collection("documents");
    expect(ref.isEqual(data.data.reference)).toBe(true);
    expect(ref.isEqual(data.data.references[0])).toBe(true);
  });

  describe("deserializes documents with queries", () => {
    test("field filter (where: comparison)", () => {
      const data = deserializeDocument(
        {
          path: "documents/1",
          data: {
            ref: {
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: ["documents", "1"] },
                collectionId: "threads",
                filters: [
                  {
                    op: "GREATER_THAN",
                    field: { segments: ["details", "count"] },
                    value: 10,
                  },
                  {
                    op: "LESS_THAN_OR_EQUAL",
                    field: { segments: ["details", "count"] },
                    value: 100,
                  },
                ],
                fieldOrders: [],
              },
            } satisfies SerializedQuery,
          },
          queries: ["ref"],
        },
        firestore,
      );
      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents/1/threads");
      const query = col
        .where("details.count", ">", 10)
        .where("details.count", "<=", 100);
      expect(query.isEqual(data.data.ref)).toBe(true);
    });

    test("field filter (where: equality)", () => {
      const data = deserializeDocument(
        {
          path: "documents/1",
          data: {
            ref: {
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: ["documents", "1"] },
                collectionId: "threads",
                filters: [
                  { field: { segments: ["id"] }, op: "EQUAL", value: "1" },
                  {
                    field: { segments: ["user"] },
                    op: "NOT_EQUAL",
                    value: "123",
                  },
                ],
                fieldOrders: [],
              },
            } satisfies SerializedQuery,
          },
          queries: ["ref"],
        },
        firestore,
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents/1/threads");
      const query = col.where("id", "==", "1").where("user", "!=", "123");
      expect(query.isEqual(data.data.ref)).toBe(true);
    });

    test("field filter (where: array)", () => {
      const data = deserializeDocument(
        {
          path: "documents/1",
          data: {
            ref: {
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: ["documents", "1"] },
                collectionId: "threads",
                filters: [
                  {
                    field: { segments: ["id"] },
                    op: "IN",
                    value: [15, 16, 17],
                  },
                  {
                    field: { segments: ["count"] },
                    op: "ARRAY_CONTAINS",
                    value: [1, 2, 3, 4],
                  },
                ],
                fieldOrders: [],
              },
            } satisfies SerializedQuery,
          },
          queries: ["ref"],
        },
        firestore,
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents/1/threads");
      const query = col
        .where("id", "in", [15, 16, 17])
        .where("count", "array-contains", [1, 2, 3, 4]);
      expect(query.isEqual(data.data.ref)).toBe(true);
    });

    test("field order (orderBy)", () => {
      const data = deserializeDocument(
        {
          path: "documents/1",
          data: {
            ref: {
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: ["documents", "1"] },
                collectionId: "threads",
                filters: [],
                fieldOrders: [
                  { field: { segments: ["id"] }, direction: "ASCENDING" },
                  { field: { segments: ["date"] }, direction: "DESCENDING" },
                ],
              },
            } satisfies SerializedQuery,
          },
          queries: ["ref"],
        },
        firestore,
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents/1/threads");
      const query = col.orderBy("id", "asc").orderBy("date", "desc");
      expect(query.isEqual(data.data.ref)).toBe(true);
    });

    test("startAt (with integer proto field)", () => {
      const data = deserializeDocument(
        {
          path: "documents/1",
          data: {
            ref: {
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: [""] },
                collectionId: "documents",
                filters: [],
                fieldOrders: [
                  { field: { segments: ["id"] }, direction: "ASCENDING" },
                ],
                startAt: {
                  before: true,
                  values: [{ integerValue: 10 }],
                },
              },
            } satisfies SerializedQuery,
          },
          queries: ["ref"],
        },
        firestore,
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents");
      const query = col.orderBy("id", "asc").startAt(10);
      expect(query.isEqual(data.data.ref)).toBe(true);
    });

    test("startAfter (with nested map proto fields)", () => {
      const data = deserializeDocument(
        {
          path: "documents/1",
          data: {
            ref: {
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: [""] },
                collectionId: "documents",
                filters: [],
                fieldOrders: [
                  {
                    field: { segments: ["properties"] },
                    direction: "DESCENDING",
                  },
                ],
                startAt: {
                  before: false,
                  values: [
                    {
                      mapValue: {
                        fields: {
                          info: {
                            mapValue: {
                              fields: { strength: { stringValue: "high" } },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            } satisfies SerializedQuery,
          },
          queries: ["ref"],
        },
        firestore,
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents");
      const query = col
        .orderBy("properties", "desc")
        .startAfter({ info: { strength: "high" } });
      expect(query.isEqual(data.data.ref)).toBe(true);
    });

    test("endAt (with boolean and array proto fields)", () => {
      const data = deserializeDocument(
        {
          path: "documents/1",
          data: {
            ref: {
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: [""] },
                collectionId: "documents",
                filters: [],
                fieldOrders: [
                  {
                    field: { segments: ["properties"] },
                    direction: "ASCENDING",
                  },
                ],
                endAt: {
                  before: false,
                  values: [
                    {
                      mapValue: {
                        fields: {
                          error: { booleanValue: true },
                          counts: {
                            arrayValue: {
                              values: [
                                { integerValue: 1 },
                                { integerValue: 2 },
                                { integerValue: 3 },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            } satisfies SerializedQuery,
          },
          queries: ["ref"],
        },
        firestore,
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents");
      const query = col
        .orderBy("properties")
        .endAt({ error: true, counts: [1, 2, 3] });
      expect(query.isEqual(data.data.ref)).toBe(true);
    });

    test("endBefore (with multiple proto fields)", () => {
      const data = deserializeDocument(
        {
          path: "documents/1",
          data: {
            ref: {
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: [""] },
                collectionId: "documents",
                filters: [],
                fieldOrders: [
                  { field: { segments: ["average"] }, direction: "ASCENDING" },
                  {
                    field: { segments: ["properties"] },
                    direction: "ASCENDING",
                  },
                ],
                endAt: {
                  before: true,
                  values: [
                    { doubleValue: 12.5 },
                    {
                      mapValue: {
                        fields: {
                          color: { stringValue: "blue" },
                        },
                      },
                    },
                  ],
                },
              },
            } satisfies SerializedQuery,
          },
          queries: ["ref"],
        },
        firestore,
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents");
      const query = col
        .orderBy("average")
        .orderBy("properties")
        .endBefore(12.5, { color: "blue" });
      expect(query.isEqual(data.data.ref)).toBe(true);
    });

    test("limit", () => {
      const data = deserializeDocument(
        {
          path: "documents/1",
          data: {
            ref: {
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: [""] },
                collectionId: "documents",
                filters: [],
                fieldOrders: [],
                limit: 10,
                limitType: 0,
              },
            } as SerializedQuery,
          },
          queries: ["ref"],
        },
        firestore,
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents");
      const query = col.limit(10);
      expect(query.isEqual(data.data.ref)).toBe(true);
    });

    test("limitToLast", () => {
      const data = deserializeDocument(
        {
          path: "documents/1",
          data: {
            ref: {
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: [""] },
                collectionId: "documents",
                filters: [],
                fieldOrders: [],
                limit: 10,
                limitType: 1,
              },
            } satisfies SerializedQuery,
          },
          queries: ["ref"],
        },
        firestore,
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents");
      const query = col.limitToLast(10);
      expect(query.isEqual(data.data.ref)).toBe(true);
    });

    test("offset", () => {
      const data = deserializeDocument(
        {
          path: "documents/1",
          data: {
            ref: {
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: [""] },
                collectionId: "documents",
                filters: [],
                fieldOrders: [],
                offset: 10,
              },
            } as SerializedQuery,
          },
          queries: ["ref"],
        },
        firestore,
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents");
      const query = col.offset(10);
      expect(query.isEqual(data.data.ref)).toBe(true);
    });
  });
});

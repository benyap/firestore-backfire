import { Firestore } from "@google-cloud/firestore";

import { SerializedGeoPoint, SerializedQuery, SerializedTimestamp } from "~/types";

import { deserializeDocuments } from "~/utils/serialization/deserialize";

describe(deserializeDocuments.name, () => {
  let firestore: Firestore;

  beforeAll(() => {
    firestore = new Firestore({ projectId: "demo" });
  });

  it("deserializes plain documents", () => {
    const data = deserializeDocuments(
      firestore,
      JSON.stringify({
        path: "documents/1",
        data: {
          from: "example@email.com",
          to: ["recipient1@email.com", "recipient2@email.com"],
          content: "Dear John,\nHello world!",
          attachments: 2,
          tags: { work: true, important: true },
        },
      })
    );
    expect(data).toMatchSnapshot();
  });

  it("deserializes documents as arrays", () => {
    const data = deserializeDocuments(
      firestore,
      JSON.stringify([
        { path: "documents/1", data: {} },
        { path: "documents/2", data: {} },
        { path: "documents/3", data: {} },
      ])
    );
    expect(data).toMatchSnapshot();
  });

  it("deserializes documents with timestamps", () => {
    const seconds = new Date("2022-01-01").getTime() / 1000;
    const data = deserializeDocuments(
      firestore,
      JSON.stringify({
        path: "documents/1",
        data: {
          id: "1",
          date: <SerializedTimestamp>{ _seconds: seconds, _nanoseconds: 0 },
          nested: {
            dates: [
              <SerializedTimestamp>{ _seconds: seconds, _nanoseconds: 0 },
              <SerializedTimestamp>{ _seconds: seconds, _nanoseconds: 0 },
            ],
          },
        },
        timestamps: ["date", "nested.dates.0", "nested.dates.1"],
      })
    );
    expect(data).toMatchSnapshot();
    expect(data[0].data.date.toDate()).toMatchSnapshot();
  });

  it("deserializes documents with geopoints", () => {
    const data = deserializeDocuments(
      firestore,
      JSON.stringify({
        path: "documents/1",
        data: {
          id: "1",
          point: <SerializedGeoPoint>{ _latitude: 10, _longitude: 20 },
          nested: {
            places: [
              <SerializedGeoPoint>{ _latitude: 11, _longitude: 20 },
              <SerializedGeoPoint>{ _latitude: 12, _longitude: 20 },
            ],
          },
        },
        geopoints: ["point", "nested.places.0", "nested.places.1"],
      })
    );
    expect(data).toMatchSnapshot();
  });

  it("deserializes documents with document references", () => {
    const data = deserializeDocuments(
      firestore,
      JSON.stringify({
        path: "documents/1",
        data: {
          id: "1",
          reference: {
            _firestore: { projectId: "demo" },
            _path: { segments: ["documents", "2"] },
          },
          references: [
            {
              _firestore: { projectId: "demo" },
              _path: { segments: ["documents", "2"] },
            },
          ],
        },
        documents: ["reference", "references.0"],
      })
    );
    expect(data).toMatchSnapshot();
    const ref = firestore.doc("documents/2");
    expect(ref.isEqual(data[0].data.reference)).toBe(true);
    expect(ref.isEqual(data[0].data.references[0])).toBe(true);
  });

  it("deserializes documents with collection references", () => {
    const data = deserializeDocuments(
      firestore,
      JSON.stringify({
        path: "documents/1",
        data: {
          id: "1",
          reference: <SerializedQuery>{
            _firestore: { projectId: "demo" },
            _queryOptions: {
              parentPath: { segments: [] },
              collectionId: "documents",
              fieldFilters: [],
              fieldOrders: [],
            },
          },
          references: [
            <SerializedQuery>{
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: [] },
                collectionId: "documents",
                fieldFilters: [],
                fieldOrders: [],
              },
            },
          ],
        },
        queries: ["reference", "references.0"],
      })
    );
    expect(data).toMatchSnapshot();
    const ref = firestore.collection("documents");
    expect(ref.isEqual(data[0].data.reference)).toBe(true);
    expect(ref.isEqual(data[0].data.references[0])).toBe(true);
  });

  describe("deserializes documents with queries", () => {
    it("field filter (where: comparison)", () => {
      const data = deserializeDocuments(
        firestore,
        JSON.stringify({
          path: "documents/1",
          data: {
            ref: <SerializedQuery>{
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: ["documents", "1"] },
                collectionId: "threads",
                fieldFilters: [
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
            },
          },
          queries: ["ref"],
        })
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents/1/threads");
      col.where("details.count", ">", 10).where("details.count", "<=", 100);

      // FIXME: Currently failing due to https://github.com/googleapis/nodejs-firestore/issues/1652
      // expect(query.isEqual(data[0].data.ref)).toBe(true);
    });

    it("field filter (where: equality)", () => {
      const data = deserializeDocuments(
        firestore,
        JSON.stringify({
          path: "documents/1",
          data: {
            ref: <SerializedQuery>{
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: ["documents", "1"] },
                collectionId: "threads",
                fieldFilters: [
                  { field: { segments: ["id"] }, op: "EQUAL", value: "1" },
                  { field: { segments: ["user"] }, op: "NOT_EQUAL", value: "123" },
                ],
                fieldOrders: [],
              },
            },
          },
          queries: ["ref"],
        })
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents/1/threads");
      col.where("id", "==", "1").where("user", "!=", "123");

      // FIXME: Currently failing due to https://github.com/googleapis/nodejs-firestore/issues/1652
      // expect(query.isEqual(data[0].data.ref)).toBe(true);
    });

    it("field filter (where: array)", () => {
      const data = deserializeDocuments(
        firestore,
        JSON.stringify({
          path: "documents/1",
          data: {
            ref: <SerializedQuery>{
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: ["documents", "1"] },
                collectionId: "threads",
                fieldFilters: [
                  { field: { segments: ["id"] }, op: "IN", value: [15, 16, 17] },
                  {
                    field: { segments: ["count"] },
                    op: "ARRAY_CONTAINS",
                    value: [1, 2, 3, 4],
                  },
                ],
                fieldOrders: [],
              },
            },
          },
          queries: ["ref"],
        })
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents/1/threads");
      col
        .where("id", "in", [15, 16, 17])
        .where("count", "array-contains", [1, 2, 3, 4]);

      // FIXME: Currently failing due to https://github.com/googleapis/nodejs-firestore/issues/1652
      // expect(query.isEqual(data[0].data.ref)).toBe(true);
    });

    it("field order (orderBy)", () => {
      const data = deserializeDocuments(
        firestore,
        JSON.stringify({
          path: "documents/1",
          data: {
            ref: <SerializedQuery>{
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: ["documents", "1"] },
                collectionId: "threads",
                fieldFilters: [],
                fieldOrders: [
                  { field: { segments: ["id"] }, direction: "ASCENDING" },
                  { field: { segments: ["date"] }, direction: "DESCENDING" },
                ],
              },
            },
          },
          queries: ["ref"],
        })
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents/1/threads");
      const query = col.orderBy("id", "asc").orderBy("date", "desc");
      expect(query.isEqual(data[0].data.ref)).toBe(true);
    });

    it("startAt (with integer proto field)", () => {
      const data = deserializeDocuments(
        firestore,
        JSON.stringify({
          path: "documents/1",
          data: {
            ref: <SerializedQuery>{
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: [""] },
                collectionId: "documents",
                fieldFilters: [],
                fieldOrders: [
                  { field: { segments: ["id"] }, direction: "ASCENDING" },
                ],
                startAt: {
                  before: true,
                  values: [{ integerValue: 10 }],
                },
              },
            },
          },
          queries: ["ref"],
        })
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents");
      const query = col.orderBy("id", "asc").startAt(10);
      expect(query.isEqual(data[0].data.ref)).toBe(true);
    });

    it("startAfter (with nested map proto fields)", () => {
      const data = deserializeDocuments(
        firestore,
        JSON.stringify({
          path: "documents/1",
          data: {
            ref: <SerializedQuery>{
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: [""] },
                collectionId: "documents",
                fieldFilters: [],
                fieldOrders: [
                  { field: { segments: ["properties"] }, direction: "DESCENDING" },
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
            },
          },
          queries: ["ref"],
        })
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents");
      const query = col
        .orderBy("properties", "desc")
        .startAfter({ info: { strength: "high" } });
      expect(query.isEqual(data[0].data.ref)).toBe(true);
    });

    it("endAt (with boolean and array proto fields)", () => {
      const data = deserializeDocuments(
        firestore,
        JSON.stringify({
          path: "documents/1",
          data: {
            ref: <SerializedQuery>{
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: [""] },
                collectionId: "documents",
                fieldFilters: [],
                fieldOrders: [
                  { field: { segments: ["properties"] }, direction: "ASCENDING" },
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
            },
          },
          queries: ["ref"],
        })
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents");
      const query = col
        .orderBy("properties")
        .endAt({ error: true, counts: [1, 2, 3] });
      expect(query.isEqual(data[0].data.ref)).toBe(true);
    });

    it("endBefore (with multiple proto fields)", () => {
      const data = deserializeDocuments(
        firestore,
        JSON.stringify({
          path: "documents/1",
          data: {
            ref: <SerializedQuery>{
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: [""] },
                collectionId: "documents",
                fieldFilters: [],
                fieldOrders: [
                  { field: { segments: ["average"] }, direction: "ASCENDING" },
                  { field: { segments: ["properties"] }, direction: "ASCENDING" },
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
            },
          },
          queries: ["ref"],
        })
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents");
      const query = col
        .orderBy("average")
        .orderBy("properties")
        .endBefore(12.5, { color: "blue" });
      expect(query.isEqual(data[0].data.ref)).toBe(true);
    });

    it("limit", () => {
      const data = deserializeDocuments(
        firestore,
        JSON.stringify({
          path: "documents/1",
          data: {
            ref: <SerializedQuery>{
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: [""] },
                collectionId: "documents",
                fieldFilters: [],
                fieldOrders: [],
                limit: 10,
                limitType: 0,
              },
            },
          },
          queries: ["ref"],
        })
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents");
      const query = col.limit(10);
      expect(query.isEqual(data[0].data.ref)).toBe(true);
    });

    it("limitToLast", () => {
      const data = deserializeDocuments(
        firestore,
        JSON.stringify({
          path: "documents/1",
          data: {
            ref: <SerializedQuery>{
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: [""] },
                collectionId: "documents",
                fieldFilters: [],
                fieldOrders: [],
                limit: 10,
                limitType: 1,
              },
            },
          },
          queries: ["ref"],
        })
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents");
      const query = col.limitToLast(10);
      expect(query.isEqual(data[0].data.ref)).toBe(true);
    });

    it("offset", () => {
      const data = deserializeDocuments(
        firestore,
        JSON.stringify({
          path: "documents/1",
          data: {
            ref: <SerializedQuery>{
              _firestore: { projectId: "demo" },
              _queryOptions: {
                parentPath: { segments: [""] },
                collectionId: "documents",
                fieldFilters: [],
                fieldOrders: [],
                offset: 10,
              },
            },
          },
          queries: ["ref"],
        })
      );

      expect(data).toMatchSnapshot();

      const col = firestore.collection("documents");
      const query = col.offset(10);
      expect(query.isEqual(data[0].data.ref)).toBe(true);
    });
  });
});

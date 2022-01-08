import { splitIntoBatches, distributeEvenlyBySize } from "~/utils/batch";

describe(splitIntoBatches.name, () => {
  it("splits into correct number of batches when it does not divide evenly", () => {
    const batches = splitIntoBatches([1, 2, 3, 4, 5], 3);
    expect(batches).toMatchInlineSnapshot(`
      Array [
        Array [
          1,
          2,
          3,
        ],
        Array [
          4,
          5,
        ],
      ]
    `);
  });

  it("splits into correct number of batches when it divides evenly", () => {
    const batches = splitIntoBatches([1, 2, 3, 4, 5, 6], 3);
    expect(batches).toMatchInlineSnapshot(`
      Array [
        Array [
          1,
          2,
          3,
        ],
        Array [
          4,
          5,
          6,
        ],
      ]
    `);
  });
});

describe(distributeEvenlyBySize.name, () => {
  const createItems = (...sizes: number[]) => sizes.map((size) => ({ size }));

  it("distributes items into single bucket", () => {
    const result = distributeEvenlyBySize(createItems(1, 2, 1, 4), 1);
    expect(result).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "size": 1,
          },
          Object {
            "size": 2,
          },
          Object {
            "size": 1,
          },
          Object {
            "size": 4,
          },
        ],
      ]
    `);
  });

  it("distributes items evenly into multiple buckets", () => {
    const result = distributeEvenlyBySize(
      createItems(1, 2, 3, 2, 3, 1, 4, 4, 2, 3, 1),
      3
    );
    expect(
      result.map((items) => ({
        size: items.reduce((total, { size }) => total + size, 0),
        items,
      }))
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "items": Array [
            Object {
              "size": 3,
            },
            Object {
              "size": 4,
            },
            Object {
              "size": 1,
            },
          ],
          "size": 8,
        },
        Object {
          "items": Array [
            Object {
              "size": 1,
            },
            Object {
              "size": 2,
            },
            Object {
              "size": 1,
            },
            Object {
              "size": 4,
            },
          ],
          "size": 8,
        },
        Object {
          "items": Array [
            Object {
              "size": 2,
            },
            Object {
              "size": 3,
            },
            Object {
              "size": 2,
            },
            Object {
              "size": 3,
            },
          ],
          "size": 10,
        },
      ]
    `);
  });
});

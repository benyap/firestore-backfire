import { join } from "path";

import { WorkerPool } from "~/utils/workerPool";

const workerFixturePath = (identifier: string) =>
  join(__dirname, "__fixtures__", `${identifier}.worker.js`);

const numberOfWorkers = 3;

const getWorkerMessages = (pool: WorkerPool, ...order: number[]) =>
  order.map(
    (id) =>
      new Promise((resolve) =>
        pool.get(id)?.on("message", (message) => resolve(message))
      )
  );

describe(WorkerPool.name, () => {
  let pool: WorkerPool;

  beforeEach(() => {
    pool = new WorkerPool(numberOfWorkers, workerFixturePath("reply"));
    pool.createWorkers();
  });

  afterEach(async () => {
    await pool.terminateWorkers();
  });

  it("creates specified number of workers", () => {
    expect(pool.size()).toBe(numberOfWorkers);
  });

  it("workers are ready within a reasonable time (1000ms)", async () => {
    await pool.ready();
  }, 1000);

  it("can send a message to a specific worker", async () => {
    const getMessage = new Promise((resolve) => {
      pool.onMessage((message) => resolve(message));
    });
    pool.get(0)?.postMessage("hello");
    const result = await getMessage;
    expect(result).toMatchInlineSnapshot(`
      Object {
        "message": "hello",
        "workerData": Object {
          "identifier": "0",
        },
      }
    `);
  });

  it("can broadcast a message to all workers", async () => {
    const workerMessages = getWorkerMessages(pool, 0, 1, 2);
    pool.broadcast("hello all");
    const results = await Promise.all(workerMessages);
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "message": "hello all",
          "workerData": Object {
            "identifier": "0",
          },
        },
        Object {
          "message": "hello all",
          "workerData": Object {
            "identifier": "1",
          },
        },
        Object {
          "message": "hello all",
          "workerData": Object {
            "identifier": "2",
          },
        },
      ]
    `);
  });

  it("next() cycles through workers", async () => {
    const workerMessages = getWorkerMessages(pool, 0, 1, 2, 0);
    [0, 1, 2, 3].forEach((index) => pool.next()[0].postMessage(index));
    const results = await Promise.all(workerMessages);
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "message": 0,
          "workerData": Object {
            "identifier": "0",
          },
        },
        Object {
          "message": 1,
          "workerData": Object {
            "identifier": "1",
          },
        },
        Object {
          "message": 2,
          "workerData": Object {
            "identifier": "2",
          },
        },
        Object {
          "message": 0,
          "workerData": Object {
            "identifier": "0",
          },
        },
      ]
    `);
  });

  it("reset() resets the worker queue", async () => {
    const workerMessages = getWorkerMessages(pool, 0, 1, 0, 1);
    [0, 1].forEach((index) => pool.next()[0].postMessage(index));
    pool.reset();
    [0, 1].forEach((index) => pool.next()[0].postMessage(index));
    const results = await Promise.all(workerMessages);
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "message": 0,
          "workerData": Object {
            "identifier": "0",
          },
        },
        Object {
          "message": 1,
          "workerData": Object {
            "identifier": "1",
          },
        },
        Object {
          "message": 0,
          "workerData": Object {
            "identifier": "0",
          },
        },
        Object {
          "message": 1,
          "workerData": Object {
            "identifier": "1",
          },
        },
      ]
    `);
  });

  it("terminateWorkers() terminates all worker threads", async () => {
    await pool.terminateWorkers();
    const results = await Promise.all([0, 1, 2].map((id) => pool.get(id)?.done));
    expect(results).toMatchInlineSnapshot(`
      Array [
        0,
        0,
        0,
      ]
    `);
  });

  it("done() resolves when all workers are terminated", async () => {
    await pool.terminateWorkers();
    expect(await pool.done()).toMatchInlineSnapshot(`
      Array [
        Object {
          "status": "fulfilled",
          "value": 0,
        },
        Object {
          "status": "fulfilled",
          "value": 0,
        },
        Object {
          "status": "fulfilled",
          "value": 0,
        },
      ]
    `);
  });
});

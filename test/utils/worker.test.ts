import { join } from "path";

import { createWorker } from "~/utils/worker";

const workerFixturePath = (identifier: string) =>
  join(__dirname, "__fixtures__", `${identifier}.worker.js`);

describe(createWorker.name, () => {
  it("creates a worker", async () => {
    const worker = createWorker(workerFixturePath("hello"), "test");
    const result = await new Promise((resolve) => {
      worker.on("message", resolve);
    });
    expect(result).toMatchInlineSnapshot(`"hello from worker"`);
  });

  it("worker.done resolves when worker is done", async () => {
    const worker = createWorker(workerFixturePath("hello"), "test");
    expect(await worker.done).toMatchInlineSnapshot(`0`);
  });

  it("worker.done throws worker errors", async () => {
    const worker = createWorker(workerFixturePath("error"), "test");
    let error: any;
    try {
      await worker.done;
    } catch (e) {
      error = e;
    }
    expect(error).toMatchInlineSnapshot(`[Error: worker error]`);
  });
});

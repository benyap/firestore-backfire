// eslint-disable-next-line @typescript-eslint/no-var-requires
const { isMainThread, parentPort } = require("worker_threads");

if (!isMainThread) parentPort?.postMessage("hello from worker");

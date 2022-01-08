// eslint-disable-next-line @typescript-eslint/no-var-requires
const { isMainThread } = require("worker_threads");

if (!isMainThread) throw new Error("worker error");

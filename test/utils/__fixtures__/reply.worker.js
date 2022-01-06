// eslint-disable-next-line @typescript-eslint/no-var-requires
const { isMainThread, parentPort, workerData } = require("worker_threads");

if (!isMainThread)
  parentPort?.on("message", (message) => {
    parentPort.postMessage({ workerData, message });
  });

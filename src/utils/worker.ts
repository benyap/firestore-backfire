import { MessagePort, Worker } from "worker_threads";

export interface WorkerInstance extends Worker {
  ready: Promise<void>;
  done: Promise<number>;
}

/**
 * Create a new worker thread using the provided file path.
 *
 * @param filename The name of the file to fork a new worker thread from.
 * @param identifier A unique identifier for the worker thread. Will be passed as part of `workerData`.
 * @param data Additional data to pass to the worker as `workerData`.
 */
export function createWorker<T = never>(
  filename: string,
  identifier: string,
  data?: Omit<T, "identifier">
): WorkerInstance {
  const workerData = { ...data, identifier };
  const worker = new Worker(filename, { workerData }) as WorkerInstance;
  worker.ready = new Promise<void>((resolve) => worker.on("online", resolve));
  worker.done = new Promise<number>((resolve, reject) => {
    worker.on("exit", (exitCode) => resolve(exitCode));
    worker.on("error", (error) => reject(error));
  });
  return worker;
}

export function messageParent<T = any>(port: MessagePort | null, message: T) {
  port?.postMessage(message);
}

export function messageWorker<T = any>(worker: Worker, message: T) {
  worker.postMessage(message);
}

export function onMessage<T = any>(
  port: MessagePort | null,
  listener: (message: T) => any
) {
  port?.removeAllListeners().addListener("message", listener);
}

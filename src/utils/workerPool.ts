import { createWorker, WorkerInstance } from "./worker";

/**
 * Provides an abstraction over the creation and management
 * of a pool of worker threads.
 */
export class WorkerPool<MessageType = any> {
  private readonly pool: WorkerInstance[] = [];
  private workersCreated: boolean = false;
  private nextWorker: number = 0;

  /**
   * Create a new WorkerPool instance.
   */
  constructor(
    /** The number of worker threads in the pool. */
    private readonly count: number,
    /** The name of the file to fork a new worker thread from. */
    private readonly filename: string
  ) {
    if (count < 1) throw new Error(`Must have at least one worker thread.`);
  }

  /**
   * Create worker threads. If worker threads have already been
   * created, calling this function has no effect.
   *
   * @param data Data to be passed to the worker on creation.
   */
  createWorkers<T = any>(data?: T) {
    if (this.workersCreated) return;
    for (let i = this.pool.length; i < this.count; i++) {
      this.pool.push(createWorker<T>(this.filename, String(i), data));
    }
    this.workersCreated = true;
  }

  /**
   * Returns a promise that resolves when all workers are ready.
   */
  async ready(): Promise<PromiseSettledResult<void>[]> {
    const result = await Promise.allSettled(this.pool.map((w) => w.ready));
    return result;
  }

  /**
   * Returns a promise that resolves when all workers are done
   * (including exiting from errors).
   */
  async done(): Promise<PromiseSettledResult<number>[]> {
    const result = await Promise.allSettled(this.pool.map((w) => w.done));
    return result;
  }

  /**
   * Broadcast a message to all worker threads.
   *
   * @param message The message to broadcast.
   */
  broadcast<T = any>(message: T): void {
    this.pool.forEach((worker) => worker.postMessage(message));
  }

  /**
   * Terminates all workers in the pool.
   */
  async terminateWorkers() {
    await Promise.all(this.pool.map((worker) => worker.terminate()));
  }

  /**
   * Attach a listener to all "message" events. Note that this will
   * remove any previously added listeners for "message" events.
   *
   * @param listener The listener to attach.
   */
  onMessage(listener: (value: MessageType) => any) {
    this.pool.forEach((worker) => worker.removeAllListeners("message"));
    this.pool.forEach((worker) => worker.addListener("message", listener));
  }

  /**
   * Get the number of workers in the pool.
   */
  size(): number {
    return this.pool.length;
  }

  /**
   * Get a specific worker thread.
   */
  get(identifier: number): WorkerInstance | undefined {
    return this.pool[identifier];
  }

  /**
   * Peek at the id of the next worker thread that will
   * returned when `next()` is called.
   */
  peekId() {
    return this.nextWorker;
  }

  /**
   * Peek at the next worker thread that will be returned
   * when `next()` is called.
   */
  peek(): WorkerInstance {
    return this.pool[this.nextWorker];
  }

  /**
   * Get the next worker thread in the queue. Calling this
   * method will move the worker that was returned to the
   * end of the queue.
   *
   * To access a worker without moving it to the back of
   * the queue, use `peek()`.
   *
   * Worker threads are queued in the order they were created.
   */
  next(): WorkerInstance {
    const workerToReturn = this.nextWorker;
    this.nextWorker = (workerToReturn + 1) % this.size();
    return this.pool[workerToReturn];
  }

  /**
   * Reset the worker queue order.
   */
  reset() {
    this.nextWorker = 0;
  }
}

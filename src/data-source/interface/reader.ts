import { Readable } from "stream";

import { ReaderNotOpenedError } from "../errors";

export interface IDataReader {
  /**
   * The path to where the data will be read from.
   */
  readonly path: string;

  /**
   * Open a connection to the read stream.
   */
  open(): Promise<void>;

  /**
   * Read lines of data from the stream.
   *
   * Returns a list of promises, where each promise corresponds
   * to an asynchronous invocation of the {@link onData} callback.
   * If {@link onData} is not asynchronous, it will not be returned.
   */
  read(
    onData: (data: string) => void | Promise<void>
  ): Promise<Promise<void>[]>;
}

export abstract class DataStreamReader implements IDataReader {
  protected abstract stream?: Readable;

  abstract readonly path: string;

  abstract open(): Promise<void>;

  async read(
    onData: (data: string) => void | Promise<void>
  ): Promise<Promise<void>[]> {
    const promises: Promise<void>[] = [];
    return new Promise((resolve, reject) => {
      if (!this.stream) return reject(new ReaderNotOpenedError());
      this.stream
        .on("error", (error) => reject(error))
        .on("readable", async () => {
          const buffer: Buffer | null = this.stream!.read();
          const data = buffer?.toString();
          if (!data) return;
          const promise = onData(data);
          if (promise) promises.push(promise);
        })
        .on("end", () => resolve(promises));
    });
  }
}

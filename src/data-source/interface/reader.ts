import { Readable } from "stream";

import { DataSourceReaderNotOpenedError } from "../errors";

/**
 * An interface for reading data to import into Firestore from a stream.
 */
export interface IDataSourceReader {
  /**
   * The path to where data will be read from.
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

/**
 * An abstract implementation of {@link IDataSourceReader} using {@link Readable}.
 *
 * You can extend this class to create your own implementation of a data
 * source that reads from a {@link Readable} stream.
 */
export abstract class StreamReader implements IDataSourceReader {
  protected abstract stream?: Readable;

  abstract readonly path: string;

  abstract open(): Promise<void>;

  async read(
    onData: (data: string) => void | Promise<void>
  ): Promise<Promise<void>[]> {
    const promises: Promise<void>[] = [];
    return new Promise((resolve, reject) => {
      if (!this.stream) return reject(new DataSourceReaderNotOpenedError());
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

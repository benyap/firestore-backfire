import { Writable } from "stream";

import { DataSourceWriterNotOpenedError } from "../errors";

/**
 * An interface for writing data to export from Firestore using a stream.
 */
export interface IDataSourceWriter {
  /**
   * The path to where data will be written to.
   */
  readonly path: string;

  /**
   * Open a connection to the write stream.
   * Returns `true` if the write location will be overwritten.
   *
   * @param force Overwrite any existing data if the write location is not empty.
   */
  open(force?: boolean): Promise<boolean>;

  /**
   * Write lines of data to the stream. Each line should be a valid NDJSON record.
   */
  write(lines: string[]): Promise<void>;

  /**
   * Close the write stream. In most cases, this will finalise
   * the data being written to the output location.
   */
  close(): Promise<void>;
}

/**
 * An abstract implementation of {@link IDataSourceWriter} using {@link Writable}.
 *
 * You can extend this class to create your own implementation of a data
 * source that writes to a {@link Writable} stream.
 */
export abstract class StreamWriter implements IDataSourceWriter {
  protected abstract stream?: Writable;

  abstract readonly path: string;

  abstract open(force?: boolean): Promise<boolean>;

  async write(lines: string[]) {
    return new Promise<void>((resolve, reject) => {
      if (!this.stream) return reject(new DataSourceWriterNotOpenedError());
      this.stream.write(lines.join("\n") + "\n", (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  async close() {
    await new Promise<void>((resolve, reject) => {
      if (!this.stream) return reject(new DataSourceWriterNotOpenedError());
      this.stream.end(() => resolve());
    });
  }
}

export interface IDataReader {
  /**
   * The path to where the data will be read from.
   */
  readonly path: string;

  /**
   * Open a connection to the read stream.
   */
  open(): Promise<void>;

  // TODO:
  // read(): ?

  /**
   * Close the data read stream.
   */
  close(): Promise<void>;
}

export abstract class DataStreamReader implements IDataReader {
  abstract readonly path: string;

  abstract open(): Promise<void>;

  // TODO:
  abstract close(): Promise<void>;
}

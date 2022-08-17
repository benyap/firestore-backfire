export interface IDataOutput {
  /** The path to where the data will be output. */
  readonly destination: string;

  /** Write data to the output stream. */
  write(lines: string[]): Promise<void>;

  /** Close the data output stream. */
  close(): Promise<void>;
}

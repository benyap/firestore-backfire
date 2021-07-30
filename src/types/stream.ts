import { DocumentMessage } from "./message";

export interface IWriteStreamHandler {
  /**
   * The write stream path.
   */
  path: string;

  /**
   * Open the write stream for writing data.
   */
  open(): Promise<void>;

  /**
   * Write a document to the stream.
   *
   * @param message The document to write.
   */
  write(message: DocumentMessage): Promise<void>;

  /**
   * Close the stream.
   */
  close(): Promise<void>;
}

import { ReadStream } from "fs";

import { JSONArrayParser } from "./JSONArrayParser";

export class JSONArrayStream<T = any> {
  private data: string = "";
  private parser = new JSONArrayParser();

  constructor(private stream: ReadStream) {}

  /**
   * Consume data from the stream.
   */
  async consume(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      // Handle errors
      this.stream.on("error", (error) => {
        this.stream.removeAllListeners();
        reject(error);
      });

      // Handle stream end
      this.stream.on("end", () => {
        this.stream.removeAllListeners();
        resolve();
      });

      // Handle stream read
      this.stream.on("readable", () => {
        const buffer: Buffer | null = this.stream.read();
        if (buffer) this.data += buffer.toString();
        this.stream.removeAllListeners();
        resolve();
      });
    });
  }

  /**
   * Flush any parsed items from the stream.
   */
  flush(): T[] | null {
    const dataToFlush = this.data;
    this.data = "";
    if (dataToFlush) this.parser.process(dataToFlush);
    const items = this.parser.flushItems();
    if (items.length === 0 && !dataToFlush) return null;
    return items;
  }

  /**
   * Close the underlying stream.
   */
  async close(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.stream.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
}

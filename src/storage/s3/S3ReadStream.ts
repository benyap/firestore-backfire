import type { IReadStreamHandler } from "../storage.types";

export class S3ReadStream implements IReadStreamHandler {
  constructor(public readonly path: string) {}

  async open() {
    throw new Error("Method not implemented.");
  }

  async read() {
    throw new Error("Method not implemented.");
    return null;
  }

  async close() {
    throw new Error("Method not implemented.");
  }
}

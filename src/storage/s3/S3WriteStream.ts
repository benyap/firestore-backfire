import { DocumentMessage } from "../../types";
import { IWriteStreamHandler } from "../storage.types";

export class S3WriteStream implements IWriteStreamHandler {
  constructor(public readonly path: string) {}

  async open() {
    throw new Error("Method not implemented.");
  }

  async write(message: DocumentMessage) {
    console.log(message);
    throw new Error("Method not implemented.");
  }

  async close() {
    throw new Error("Method not implemented.");
  }
}

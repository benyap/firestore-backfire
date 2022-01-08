import { Writable } from "stream";

import { SerializedFirestoreDocument } from "~/types";
import { WriteStreamNotOpenError } from "~/errors";
import { serializeDocument } from "~/utils";
import { IWriteStream } from "~/services";

export abstract class JSONWriteStream implements IWriteStream {
  protected empty: boolean = true;
  protected stream?: Writable;

  constructor(public readonly path: string) {}

  abstract open(requireEmpty?: boolean): Promise<boolean>;

  async write(
    document: SerializedFirestoreDocument,
    indent: number = 0
  ): Promise<void> {
    const wasEmpty = this.empty;
    this.empty = false;
    return new Promise<void>((resolve, reject) => {
      if (!this.stream) throw new WriteStreamNotOpenError(this.path);
      const data = serializeDocument(document, indent).replace(/^(.)/gm, "  $1");
      this.stream.write((wasEmpty ? "[\n" : ",\n") + data, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  async close(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (!this.stream) return reject(new WriteStreamNotOpenError(this.path));
      this.stream.end(this.empty ? "[]" : "\n]", () => resolve());
    });
  }
}

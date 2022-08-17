import { createWriteStream, existsSync } from "fs";
import { Writable } from "stream";

import { DataOverwriteError } from "../errors";
import { DataStreamWriter } from "../interface";

export interface LocalFileOptions {}

export class LocalFileWriter extends DataStreamWriter {
  protected stream?: Writable;

  constructor(override readonly path: string) {
    super();
    if (!this.path.endsWith(".ndjson")) this.path += ".ndjson";
  }

  async open(overwrite?: boolean) {
    // Check if file exists
    let overwritten = false;
    if (existsSync(this.path)) {
      if (!overwrite) throw new DataOverwriteError(this.path);
      overwritten = true;
    }

    // Create stream
    this.stream = createWriteStream(this.path);
    return overwritten;
  }
}

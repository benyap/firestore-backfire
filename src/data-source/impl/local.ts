import { createReadStream, createWriteStream, existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import { Readable, Writable } from "stream";

import { DataOverwriteError, DataSourceUnreachableError } from "../errors";
import { DataStreamReader, DataStreamWriter } from "../interface";

class LocalSource {
  constructor(readonly path: string) {
    // TODO: might need to resolve path so it uses project dir when being executed from node_modules
    if (!this.path.endsWith(".ndjson")) this.path += ".ndjson";
  }
}

export class LocalReader extends DataStreamReader {
  private source: LocalSource;

  protected stream?: Readable;

  constructor(path: string) {
    super();
    this.source = new LocalSource(path);
  }

  override get path() {
    return this.source.path;
  }

  async open(): Promise<void> {
    if (!existsSync(this.path))
      throw new DataSourceUnreachableError("file does not exist");
    this.stream = createReadStream(this.path);
  }
}

export class LocalWriter extends DataStreamWriter {
  private source: LocalSource;

  protected stream?: Writable;

  constructor(path: string) {
    super();
    this.source = new LocalSource(path);
  }

  override get path() {
    return this.source.path;
  }

  async open(overwrite?: boolean) {
    // Create directory if it does not exist
    if (!existsSync(dirname(this.path))) {
      mkdirSync(dirname(this.path), { recursive: true });
    }

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

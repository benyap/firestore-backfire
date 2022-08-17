import { createWriteStream, WriteStream } from "fs";

import { IDataOutput } from "./interface";

export class FileDataOutput implements IDataOutput {
  private stream: WriteStream;

  constructor(public readonly destination: string) {
    this.stream = createWriteStream(destination);
  }

  async write(lines: string[]) {
    this.stream.write(lines.join("\n") + "\n");
  }

  async close() {
    this.stream.end();
  }
}

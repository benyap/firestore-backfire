import { replaceInFile } from "replace-in-file";

import { WriteStreamNotOpenError } from "../../errors";
import { FileWriteStream } from "../../sources";
import { serializeDocument } from "../../utils";

import type { DocumentMessage } from "../../types";

export class JSONArrayWriteStream extends FileWriteStream {
  constructor(public readonly path: string) {
    super(path);
    this.outPath = this.path + ".json";
  }

  /**
   * @override
   */
  async write(message: DocumentMessage) {
    return new Promise<void>((resolve, reject) => {
      if (!this.stream) return reject(new WriteStreamNotOpenError(this.path));
      const data = serializeDocument(message, 2).replace(/^(.)/gm, "  $1");
      this.stream.write(data + "\n]\n", (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  /**
   * @override
   */
  async close() {
    // Close file stream
    await new Promise<void>((resolve, reject) => {
      if (!this.stream) return reject(new WriteStreamNotOpenError(this.path));
      this.stream.end(null, () => {
        resolve();
      });
    });

    // Add commas and start / ending brackets for JSON array
    await replaceInFile({
      files: this.outPath,
      from: /^([^\[])/,
      to: "[\n$1",
    });

    await replaceInFile({
      files: this.outPath,
      from: /\n\]\n(.)/g,
      to: ",\n$1",
    });
  }
}

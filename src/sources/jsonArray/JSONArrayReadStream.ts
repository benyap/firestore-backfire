import { resolve } from "path";

import { ReadStreamNotOpenError } from "../../errors";
import { deserializeDocuments } from "../../utils";
import { FileReadStream } from "../../sources";

export class JSONArrayReadStream extends FileReadStream {
  constructor(public readonly path: string) {
    super(path);
    this.inPath = resolve(
      __dirname,
      "..",
      "..",
      "..",
      this.path.endsWith(".json") ? this.path : this.path + ".json"
    );
  }

  /**
   * @override
   */
  async read() {
    if (!this.stream) throw new ReadStreamNotOpenError(this.inPath);

    let chunk: string | null = null;
    let allChunks: string | null = null;

    // Read all JSON data before we deserialize
    while ((chunk = this.stream.read())) {
      if (!allChunks) allChunks = chunk;
      else allChunks += chunk;
    }

    // Return the deserialized documents
    return allChunks ? deserializeDocuments(allChunks) : null;
  }
}

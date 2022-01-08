import { createWriteStream, existsSync, unlinkSync } from "fs";
import { resolve } from "path";

import { WriteLocationNotEmptyError } from "~/errors";
import { createDirectory, JSONWriteStream } from "~/utils";

export class LocalStorageWriteStream extends JSONWriteStream {
  constructor(path: string) {
    super(path);
  }

  async open(force?: boolean): Promise<boolean> {
    let overwritten = false;

    createDirectory(resolve(this.path, ".."));

    if (existsSync(this.path)) {
      if (force) {
        unlinkSync(this.path);
        overwritten = true;
      } else {
        throw new WriteLocationNotEmptyError(this.path);
      }
    }

    return new Promise<boolean>((resolve, reject) => {
      this.stream = createWriteStream(this.path, {
        flags: "ax",
        encoding: "utf-8",
      });
      this.stream.on("error", (error) => reject(error));
      this.stream.on("open", () => resolve(overwritten));
    });
  }
}

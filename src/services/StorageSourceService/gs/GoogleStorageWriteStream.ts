import { File } from "@google-cloud/storage";

import { WriteLocationNotEmptyError } from "~/errors";
import { JSONWriteStream } from "~/utils";

export class GoogleStorageWriteStream extends JSONWriteStream {
  constructor(path: string, private readonly file: File) {
    super(path);
  }

  async open(force?: boolean): Promise<boolean> {
    let overwritten = false;

    const [exists] = await this.file.exists();
    if (exists) {
      if (force) {
        await this.file.delete();
        overwritten = true;
      } else {
        throw new WriteLocationNotEmptyError(this.path);
      }
    }

    return new Promise<boolean>((resolve, reject) => {
      this.stream = this.file.createWriteStream({ resumable: false });
      this.stream.on("error", (error) => reject(error));
      resolve(overwritten);
    });
  }
}

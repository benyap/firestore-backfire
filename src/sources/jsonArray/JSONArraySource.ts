import { FileSource } from "../../sources";

import { JSONArrayReadStream } from "./JSONArrayReadStream";
import { JSONArrayWriteStream } from "./JSONArrayWriteStream";

export class JSONArraySource extends FileSource {
  async openReadStream(path: string) {
    const stream = new JSONArrayReadStream(`${this.sourcePath}/${path}`);
    await stream.open();
    return stream;
  }

  async openWriteStream(path: string) {
    const stream = new JSONArrayWriteStream(`${this.sourcePath}/${path}`);
    await stream.open();
    return stream;
  }
}

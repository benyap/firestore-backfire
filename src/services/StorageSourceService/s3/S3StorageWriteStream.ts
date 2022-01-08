import {
  S3Client,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { PassThrough } from "stream";

import { WriteLocationNotEmptyError, WriteStreamNotOpenError } from "~/errors";
import { JSONWriteStream } from "~/utils";

export class S3StorageWriteStream extends JSONWriteStream {
  private upload?: Upload;

  constructor(
    path: string,
    private readonly client: S3Client,
    private readonly bucket: string,
    private readonly key: string
  ) {
    super(path);
  }

  async open(force?: boolean): Promise<boolean> {
    let overwritten = false;

    const object = { Bucket: this.bucket, Key: this.key };

    try {
      const checkCommand = new HeadObjectCommand(object);
      await this.client.send(checkCommand);
      if (force) {
        const deleteCommand = new DeleteObjectCommand(object);
        await this.client.send(deleteCommand);
        overwritten = true;
      } else {
        throw new WriteLocationNotEmptyError(this.path);
      }
    } catch (error: any) {
      // Continue if the file does not exist
      if (error.name !== "NotFound") throw error;
    }

    return new Promise<boolean>((resolve) => {
      this.stream = new PassThrough();
      this.upload = new Upload({
        client: this.client,
        params: { ...object, Body: this.stream },
      });
      resolve(overwritten);
    });
  }

  /**
   * @override
   */
  async close(): Promise<void> {
    if (!this.stream) throw new WriteStreamNotOpenError(this.path);
    this.stream.write(this.empty ? "[]" : "\n]");
    this.stream.end();
    await this.upload?.done();
  }
}

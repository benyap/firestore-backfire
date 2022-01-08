import { Firestore } from "@google-cloud/firestore";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

import { DeserializedFirestoreDocument } from "~/types";
import { deserializeDocuments, JSONArrayParser } from "~/utils";

import { IReadStream } from "../interfaces";

export class S3StorageReadStream implements IReadStream {
  constructor(
    public readonly path: string,
    private firestore: Firestore,
    private readonly client: S3Client,
    private readonly bucket: string,
    private readonly key: string
  ) {}

  async readFromStream(
    onData: (data: DeserializedFirestoreDocument<any>[]) => any
  ): Promise<void> {
    const object = { Bucket: this.bucket, Key: this.key };
    const getCommand = new GetObjectCommand(object);
    const { Body } = await this.client.send(getCommand);

    const parser = new JSONArrayParser();
    const stream = Body as Readable;

    return new Promise<void>((resolve, reject) => {
      stream
        .on("error", (error) => reject(error))
        .on("data", async (buffer: Buffer) => {
          parser.process(buffer.toString());
          const items = parser.flushItems();
          if (items.length === 0) return;
          try {
            await onData(deserializeDocuments(this.firestore, items));
          } catch (error) {
            reject(error);
          }
        })
        .on("end", () => {
          stream.destroy();
          resolve();
        });
    });
  }
}

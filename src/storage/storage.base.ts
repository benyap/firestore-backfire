import {
  IReadStreamHandler,
  IStorageSource,
  IWriteStreamHandler,
} from "./storage.types";

export abstract class StorageSource implements IStorageSource {
  constructor(public readonly path: string) {}

  async connect(): Promise<void> {
    return;
  }

  abstract listImportPaths(prefixes?: string[]): Promise<string[]>;

  abstract openReadStream(
    path: string,
    identifier?: string | number
  ): Promise<IReadStreamHandler>;

  abstract openWriteStream(
    path: string,
    identifier?: string | number
  ): Promise<IWriteStreamHandler>;
}

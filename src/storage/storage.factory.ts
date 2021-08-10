import {
  UnknownStorageProtocolError,
  FileSource,
  GoogleStorageSource,
  JSONArraySource,
} from ".";
import { StorageProtocol } from "./storage.types";

import type { IStorageSource } from "./storage.types";
import type { SharedOptions } from "../types";

/**
 * Create a storage source interface for the specified protocl.
 *
 * @param protocol The protocol being used.
 * @param path The path in the storage source.
 * @param options The program options.
 * @returns The storage source.
 */
export function createStorageSource(
  protocol: StorageProtocol,
  path: string,
  options: Partial<SharedOptions> = {}
): IStorageSource {
  switch (protocol) {
    case StorageProtocol.SnapshotFile:
      return new FileSource(path);

    case StorageProtocol.JSONFile:
      return new JSONArraySource(path);

    case StorageProtocol.GoogleCloudStorage:
      return new GoogleStorageSource(
        path,
        options.gcsProject!,
        options.gcsKeyfile,
        options.gcsCredentials
      );

    default:
      throw new UnknownStorageProtocolError(protocol);
  }
}

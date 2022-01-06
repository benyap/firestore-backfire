import {
  UnknownStorageSourceTypeError,
  UnimplementedStorageSourceTypeError,
  ConnectionError,
} from "~/errors";

import { StorageSourceOptions } from "./types";
import { IStorageSourceService } from "./interfaces";
import { LocalStorageSourceService } from "./local";

export class StorageSourceFactory {
  /**
   * Create the appropriate storage source based on the provided options.
   * Also tests the connection once the storage source has been created.
   * Throws an error if the specified source type is not available.
   */
  static async create(options: StorageSourceOptions) {
    const { type } = options;

    let service: IStorageSourceService;

    switch (type) {
      case "local":
        service = new LocalStorageSourceService();
        break;

      case "gcs":
        // TODO:
        throw new UnimplementedStorageSourceTypeError(type);

      case "s3":
        // TODO:
        throw new UnimplementedStorageSourceTypeError(type);

      default:
        throw new UnknownStorageSourceTypeError(type);
    }

    const connected = await service.testConnection();
    if (!connected)
      throw new ConnectionError(
        `connection to ${service.name} storage source timed out`,
        `Verify that connection details are correct and that your network connection is available.`
      );

    return service;
  }
}

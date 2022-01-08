import { bold } from "ansi-colors";

import {
  UnknownStorageSourceTypeError,
  ConnectionError,
  InvalidStorageSourcePathError,
  ConfigurationError,
} from "~/errors";
import { ensureStorageSourceDependencyInstalled } from "~/utils";

import { StorageSourceOptions } from "./types";
import { IStorageSourceService } from "./interfaces";
import { LocalStorageSourceService } from "./local";

export class StorageSourceFactory {
  /**
   * Create the appropriate storage source based on the provided options.
   * Also tests the connection once the storage source has been created.
   * Throws an error if the specified source type is not available.
   */
  static async create(options: Exclude<StorageSourceOptions, { type: "unknown" }>) {
    let service: IStorageSourceService;

    switch (options.type) {
      case "local":
        service = new LocalStorageSourceService();
        break;

      case "gs":
        if (!options.path.startsWith("gs://"))
          throw new InvalidStorageSourcePathError("gs", options.path);

        if (!options.gcpProject)
          throw new ConfigurationError(`${bold("gcpProject")} is required`);

        if (!options.gcpKeyfile && !options.gcpCredentials)
          throw new ConfigurationError(
            `either ${bold("gcpKeyfile")} or ${bold("gcpCredentials")} is required`
          );

        await ensureStorageSourceDependencyInstalled(
          "@google-cloud/storage",
          "Goolge Cloud Storage"
        );

        service = new (await import("./gs")).GoogleStorageSourceService(
          options.gcpProject,
          options.gcpKeyfile,
          options.gcpCredentials
        );

        break;

      case "s3":
        if (!options.path.startsWith("s3://"))
          throw new InvalidStorageSourcePathError("s3", options.path);

        if (!options.awsRegion)
          throw new ConfigurationError(`${bold("awsRegion")} is required`);

        if (
          !options.awsProfile &&
          (!options.awsAccessKeyId || !options.awsSecretAccessKey)
        )
          throw new ConfigurationError(
            `either ${bold("awsProfile")} or both ${bold(
              "awsAccessKeyId"
            )} and ${bold("awsSecretAccessKey")} are required`
          );

        await ensureStorageSourceDependencyInstalled("@aws-sdk/client-s3", "AWS S3");

        if (!options.awsAccessKeyId || !options.awsSecretAccessKey) {
          await ensureStorageSourceDependencyInstalled(
            "@aws-sdk/credential-provider-ini",
            "AWS Shared credential provider"
          );
        }

        if (options.awsAccessKeyId && options.awsSecretAccessKey) {
          service = new (await import("./s3")).S3StorageSourceService(
            options.awsRegion,
            {
              accessKeyId: options.awsAccessKeyId,
              secretAccessKey: options.awsSecretAccessKey,
            }
          );
        } else if (options.awsProfile) {
          service = new (await import("./s3")).S3StorageSourceService(
            options.awsRegion,
            (await import("@aws-sdk/credential-provider-ini")).fromIni({
              profile: options.awsProfile,
            })
          );
        } else {
          throw new ConfigurationError(
            `no valid credential options provided for AWS`
          );
        }

        break;

      default:
        throw new UnknownStorageSourceTypeError((options as any).type);
    }

    const connection = await service.testConnection(options.path);
    if (!connection.ok)
      throw new ConnectionError(
        `connection to ${service.name} storage source failed: ${connection.error}`,
        `Verify that connection details are correct and that your network connection is available.`
      );

    return service;
  }
}

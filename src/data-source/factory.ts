import { ensureDependencyInstalled } from "~/utils";

import { IDataReader, IDataWriter, DataSourceOptions } from "./interface";
import {
  DataSourceError,
  DataSourceReaderNotImplementedError,
  DataSourceWriterNotImplementedError,
} from "./errors";

export type DataSourceCreator<T> =
  | { useClass: new (path: string, options: DataSourceOptions) => T }
  | { useFactory: (path: string, options: DataSourceOptions) => Promise<T> };

export interface DataSourceRegistration {
  id: string;
  match: (path: string) => boolean;
  reader?: DataSourceCreator<IDataReader>;
  writer?: DataSourceCreator<IDataWriter>;
}

class DataSourceFactory {
  private sources: { [id: string]: DataSourceRegistration } = {};

  constructor(private defaultDataSource: DataSourceRegistration) {
    this.register(defaultDataSource);
  }

  register(registration: DataSourceRegistration) {
    this.sources[registration.id] = registration;
  }

  getDataSource(path: string) {
    for (const id in this.sources) {
      const dataSource = this.sources[id]!;
      if (!dataSource.match(path)) continue;
      return dataSource;
    }
    return this.defaultDataSource;
  }

  async createReader(
    path: string,
    options: DataSourceOptions
  ): Promise<IDataReader> {
    const { id, reader } = this.getDataSource(path);
    if (!reader) throw new DataSourceReaderNotImplementedError(id);
    if ("useClass" in reader) return new reader.useClass(path, options);
    if ("useFactory" in reader) return await reader.useFactory(path, options);
    throw new DataSourceReaderNotImplementedError(id);
  }

  async createWriter(
    path: string,
    options: DataSourceOptions
  ): Promise<IDataWriter> {
    const { id, writer } = this.getDataSource(path);
    if (!writer) throw new DataSourceWriterNotImplementedError(id);
    if ("useClass" in writer) return new writer.useClass(path, options);
    if ("useFactory" in writer) return await writer.useFactory(path, options);
    throw new DataSourceReaderNotImplementedError(id);
  }
}

//
// Create factory and register implementations
//

export const dataSourceFactory = new DataSourceFactory({
  id: "local",
  match: (path) => path.startsWith("file://"),
  writer: {
    useFactory: (path) =>
      import("./impl/local").then((module) => new module.LocalFileWriter(path)),
  },
});

dataSourceFactory.register({
  id: "gcs",
  match: (path) => path.startsWith("gs://"),
  writer: {
    async useFactory(path, options) {
      const { gcpProject, gcpKeyFile, gcpCredentials } = options;

      if (!gcpProject) throw new DataSourceError("`gcpProject` is required");

      if (!gcpKeyFile && !gcpCredentials)
        throw new DataSourceError(
          "either `gcpKeyFile` or `gcpCredentials` is required"
        );

      await ensureDependencyInstalled(
        "@google-cloud/storage",
        "required to use Google Cloud Storage data source"
      );

      const Writer = await import("./impl/gcs").then(
        (m) => m.GoogleCloudStorageWriter
      );

      if (gcpKeyFile)
        return new Writer(path, gcpProject, { keyFile: gcpKeyFile });

      if (gcpCredentials)
        return new Writer(path, gcpProject, { credentials: gcpCredentials });

      throw new DataSourceError(
        "no credentials provided for Google Cloud Storage data source"
      );
    },
  },
});

dataSourceFactory.register({
  id: "s3",
  match: (path) => path.startsWith("s3://"),
  writer: {
    async useFactory(path, options) {
      const { awsRegion, awsProfile, awsAccessKeyId, awsSecretAccessKey } =
        options;

      if (!awsRegion) throw new DataSourceError("`awsRegion` is required");

      if (!awsProfile && (!awsAccessKeyId || !awsSecretAccessKey))
        throw new DataSourceError(
          "either `awsProfile` or both `awsAccessKeyId` and `awsSecretAccessKey` are required"
        );

      await ensureDependencyInstalled(
        "@aws-sdk/client-s3",
        "required to use S3 data source"
      );

      await ensureDependencyInstalled(
        "@aws-sdk/lib-storage",
        "required to use S3 data source"
      );

      const Writer = await import("./impl/s3").then((m) => m.S3Writer);

      if (awsAccessKeyId && awsSecretAccessKey) {
        return new Writer(path, awsRegion, {
          accessKeyId: awsAccessKeyId,
          secretAccessKey: awsSecretAccessKey,
        });
      }

      if (awsProfile) {
        await ensureDependencyInstalled(
          "@aws-sdk/credential-provider-ini",
          "required to use S3 data source with shared credentials"
        );
        const SharedCredential = await import(
          "@aws-sdk/credential-provider-ini"
        );
        console.log(SharedCredential.fromIni({ profile: awsProfile }));
        return new Writer(
          path,
          awsRegion,
          SharedCredential.fromIni({ profile: awsProfile })
        );
      }

      throw new DataSourceError("no credentials provided for S3 data source");
    },
  },
});

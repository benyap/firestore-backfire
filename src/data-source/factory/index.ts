import { LocalReader, LocalWriter } from "../impl/local";

import { DataSourceFactory } from "./DataSourceFactory";
import { getGoogleCloudStorageOptions } from "./gcs";
import { getS3Options } from "./s3";

export * from "./DataSourceFactory";

/**
 * The default data source factory. Contains the following
 * data sources registered by default:
 *  - `Local` - reads and writes from local files on your machine (default)
 *  - `Google Cloud Storage` - reads and writes from Google Cloud Storage (matches paths starting with `gs://`)
 *  - `S3` - reads and writes data from AWS S3 (matches paths starting with `s3://`)
 *
 * Register custom data source implementations using the
 * {@link dataSourceFactory.register()} method.
 */
export const dataSourceFactory = new DataSourceFactory({
  id: "Local",
  reader: { useClass: LocalReader },
  writer: { useClass: LocalWriter },
});

dataSourceFactory.register({
  id: "Google Cloud Storage",
  match: (path) => path.startsWith("gs://"),
  reader: {
    async useFactory(path, options) {
      const opt = await getGoogleCloudStorageOptions(options);
      const GCSReader = await import("../impl/gcs").then(
        (m) => m.GoogleCloudStorageReader
      );
      if (opt.gcpCredentials)
        return new GCSReader(path, opt.gcpProject, opt.gcpCredentials);
      else return new GCSReader(path, opt.gcpProject, opt.gcpKeyFile);
    },
  },
  writer: {
    async useFactory(path, options) {
      const opt = await getGoogleCloudStorageOptions(options);
      const GCSWriter = await import("../impl/gcs").then(
        (m) => m.GoogleCloudStorageWriter
      );
      if (opt.gcpCredentials)
        return new GCSWriter(path, opt.gcpProject, opt.gcpCredentials);
      else return new GCSWriter(path, opt.gcpProject, opt.gcpKeyFile);
    },
  },
});

dataSourceFactory.register({
  id: "S3",
  match: (path) => path.startsWith("s3://"),
  reader: {
    async useFactory(path, options) {
      const opt = await getS3Options(options);
      const S3Reader = await import("../impl/s3").then((m) => m.S3Reader);
      if (opt.awsCredential)
        return new S3Reader(path, opt.awsRegion, opt.awsCredential);
      else
        return new S3Reader(path, opt.awsRegion, {
          accessKeyId: opt.awsAccessKeyId,
          secretAccessKey: opt.awsSecretAccessKey,
        });
    },
  },
  writer: {
    async useFactory(path, options) {
      const opt = await getS3Options(options);
      const S3Writer = await import("../impl/s3").then((m) => m.S3Writer);
      if (opt.awsCredential)
        return new S3Writer(path, opt.awsRegion, opt.awsCredential);
      else
        return new S3Writer(path, opt.awsRegion, {
          accessKeyId: opt.awsAccessKeyId,
          secretAccessKey: opt.awsSecretAccessKey,
        });
    },
  },
});

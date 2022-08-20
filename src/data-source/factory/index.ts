import { LocalReader, LocalWriter } from "../impl/local";

import { DataSourceFactory } from "./DataSourceFactory";
import { getGCSOptions } from "./gcs";
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
  id: "local",
  reader: { useClass: LocalReader },
  writer: { useClass: LocalWriter },
});

dataSourceFactory.register({
  id: "gcs",
  match: (path) => path.startsWith("gs://"),
  reader: {
    async useFactory(path, options) {
      const opt = await getGCSOptions(options);
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
      const opt = await getGCSOptions(options);
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
  id: "s3",
  match: (path) => path.startsWith("s3://"),
  reader: {
    async useFactory(path, options) {
      const opt = await getS3Options(options);
      const S3Reader = await import("../impl/s3").then((m) => m.S3Reader);
      if (opt.awsCredential)
        return new S3Reader(path, opt.awsCredential, opt.awsRegion);
      else
        return new S3Reader(
          path,
          {
            accessKeyId: opt.awsAccessKeyId,
            secretAccessKey: opt.awsSecretAccessKey,
          },
          opt.awsRegion
        );
    },
  },
  writer: {
    async useFactory(path, options) {
      const opt = await getS3Options(options);
      const S3Writer = await import("../impl/s3").then((m) => m.S3Writer);
      if (opt.awsCredential)
        return new S3Writer(path, opt.awsCredential, opt.awsRegion);
      else
        return new S3Writer(
          path,
          {
            accessKeyId: opt.awsAccessKeyId,
            secretAccessKey: opt.awsSecretAccessKey,
          },
          opt.awsRegion
        );
    },
  },
});

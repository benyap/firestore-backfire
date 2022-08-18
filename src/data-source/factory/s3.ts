import { ensureDependencyInstalled } from "~/utils";

import { DataSourceError } from "../errors";
import { DataSourceOptions } from "../interface";

export async function getS3Options(options: DataSourceOptions) {
  const { awsRegion, awsProfile, awsAccessKeyId, awsSecretAccessKey } = options;

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

  if (awsAccessKeyId && awsSecretAccessKey)
    return { awsRegion, awsAccessKeyId, awsSecretAccessKey };

  if (awsProfile) {
    await ensureDependencyInstalled(
      "@aws-sdk/credential-provider-ini",
      "required to use S3 data source with shared credentials"
    );
    const SharedCredential = await import("@aws-sdk/credential-provider-ini");
    return {
      awsRegion,
      awsCredential: SharedCredential.fromIni({ profile: awsProfile }),
    };
  }

  throw new DataSourceError("no credentials provided for S3 data source");
}

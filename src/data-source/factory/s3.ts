import { ensureDependencyInstalled } from "~/utils";

import { DataSourceError } from "../errors";
import { DataSourceOptions } from "../interface";

export async function getS3Options(options: DataSourceOptions) {
  const {
    awsProfile = process.env["AWS_PROFILE"],
    awsAccessKeyId = process.env["AWS_ACCESS_KEY_ID"],
    awsSecretAccessKey = process.env["AWS_SECRET_ACCESS_KEY"],
    awsRegion = process.env["AWS_REGION"],
  } = options;

  if (!awsProfile && (!awsAccessKeyId || !awsSecretAccessKey))
    throw new DataSourceError(
      "either `awsProfile` or both `awsAccessKeyId` and `awsSecretAccessKey` are required"
    );

  if (!awsRegion) throw new DataSourceError("`awsRegion` is required");

  ensureDependencyInstalled(
    "@aws-sdk/client-s3",
    "required to use S3 data source"
  );

  if (awsAccessKeyId && awsSecretAccessKey)
    return { awsAccessKeyId, awsSecretAccessKey, awsRegion };

  if (awsProfile) {
    ensureDependencyInstalled(
      "@aws-sdk/credential-provider-ini",
      "required to use S3 data source with shared credentials"
    );
    const SharedCredential = await import("@aws-sdk/credential-provider-ini");
    return {
      awsCredential: SharedCredential.fromIni({ profile: awsProfile }),
      awsRegion,
    };
  }

  throw new DataSourceError("no credentials provided for S3 data source");
}

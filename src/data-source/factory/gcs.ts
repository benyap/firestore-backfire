import { ensureDependencyInstalled } from "~/utils";

import { DataSourceError } from "../errors";
import type { DataSourceOptions } from "../interface";

export async function getGCSOptions(options: DataSourceOptions) {
  const {
    gcpProject = process.env["GOOGLE_CLOUD_PROJECT"],
    gcpKeyFile = process.env["GOOGLE_APPLICATION_CREDENTIALS"],
    gcpCredentials,
    gcpAdc,
  } = options;

  if (!gcpProject) throw new DataSourceError("`gcpProject` is required");

  if (!gcpKeyFile && !gcpCredentials && !gcpAdc)
    throw new DataSourceError(
      "either `gcpAdc`, `gcpKeyFile` or `gcpCredentials` is required",
    );

  await ensureDependencyInstalled(
    "@google-cloud/storage",
    "required to use Google Cloud Storage data source",
  );

  if (gcpCredentials) return { gcpProject, gcpCredentials };
  if (gcpKeyFile) return { gcpProject, gcpKeyFile };
  if (gcpAdc) return { gcpProject };

  throw new DataSourceError(
    "no credentials provided for Google Cloud Storage data source",
  );
}

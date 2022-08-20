import { ensureDependencyInstalled } from "~/utils";

import { DataSourceError } from "../errors";
import type { DataSourceOptions } from "../interface";

export async function getGCSOptions(options: DataSourceOptions) {
  const {
    gcpProject = process.env["GOOGLE_CLOUD_PROJECT"],
    gcpKeyFile = process.env["GOOGLE_APPLICATION_CREDENTIALS"],
    gcpCredentials,
  } = options;

  if (!gcpProject) throw new DataSourceError("`gcpProject` is required");

  if (!gcpKeyFile && !gcpCredentials)
    throw new DataSourceError(
      "either `gcpKeyFile` or `gcpCredentials` is required"
    );

  await ensureDependencyInstalled(
    "@google-cloud/storage",
    "required to use Google Cloud Storage data source"
  );

  if (gcpKeyFile) return { gcpProject, gcpKeyFile };
  if (gcpCredentials) return { gcpProject, gcpCredentials };

  throw new DataSourceError(
    "no credentials provided for Google Cloud Storage data source"
  );
}

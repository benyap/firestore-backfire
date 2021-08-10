import { Option } from "commander";

import { Constants } from "../config";
import { validateMinMaxInteger } from "../utils";

// Global options
export const GLOBAL = [new Option("--verbose", "output verbose logs")];

// Firebase options
export const FIREBASE = [
  new Option("-P, --project <project>", "the Firebase project id"),
  new Option(
    "-K, --keyfile <path>",
    "path to Firebase service account credentials JSON file"
  ),
  new Option("-E, --emulator <host>", "use the local Firestore emulator"),
];

// Google Cloud Storage options
export const GCS = [
  new Option(
    "--gcs-project <project>",
    "the Google Cloud project id (required if using GCS)"
  ),
  new Option(
    "--gcs-keyfile <path>",
    "path to Google Cloud service account credentials JSON file (required if using GCS)"
  ),
];

// S3 options
// TODO:
// export const S3 = [];

// Export options
export const EXPORT = [
  new Option(
    "--collections [collections...]",
    "name of the root collections to export (all collections exported if not specified)"
  ),
  new Option(
    "--patterns [regex...]",
    "regex patterns that a document path must match to be exported"
  ),
  new Option("--depth <number>", "subcollection depth to export")
    .argParser((value: string, _) =>
      validateMinMaxInteger(value, 0, Constants.MAX_DEPTH)
    )
    .default(Constants.MAX_DEPTH),
  new Option("--concurrency <number>", "number of concurrent processes allowed")
    .argParser((value: string, _) =>
      validateMinMaxInteger(value, 1, Constants.MAX_CONCURRENCY)
    )
    .default(Constants.MAX_CONCURRENCY),
  new Option(
    "--json",
    "outputs data in JSON array format (only applies when exporting to local files)"
  ),
];

// Import options
export const IMPORT = [
  new Option(
    "--collections [collections...]",
    "name of the root collections to import (all collections imported if not specified)"
  ),
  new Option(
    "--patterns [regex...]",
    "regex patterns that a document path must match to be imported"
  ),
  new Option("--depth <number>", "subcollection depth to import")
    .argParser((value: string, _) =>
      validateMinMaxInteger(value, 0, Constants.MAX_DEPTH)
    )
    .default(Constants.MAX_DEPTH),
  new Option("--concurrency <number>", "number of concurrent processes allowed")
    .argParser((value: string, _) =>
      validateMinMaxInteger(value, 1, Constants.MAX_CONCURRENCY)
    )
    .default(Constants.MAX_CONCURRENCY),
  new Option(
    "--json",
    "import data from JSON array format (only applies when importing from local files)"
  ),
];

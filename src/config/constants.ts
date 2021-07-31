import { version } from "../version.json";

export const NAME = "backfire";
export const DESCRIPTION =
  "Ultimate control over backing up and restoring your Firestore data";
export const VERSION = version;

export const MAX_CONCURRENCY = 10;
export const MAX_DEPTH = 100;
export const WAIT_TIME = 500;

/**
 * List of supported file protocols.
 */
export const SUPPORTED_PROTOCOLS = new Set<string>([
  "file",
  // "s3", // TODO:
  // "gs", // TODO:
]);

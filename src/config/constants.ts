import { version } from "../version.json";

export const VERSION = version;
export const MODULE_NAME = "firestorebackup";
export const MAX_CONCURRENCY = 10;
export const MAX_DEPTH = 100;

/**
 * List of supported file protocols.
 */
export const SUPPORTED_PROTOCOLS = new Set<string>([
  "file",
  // "s3", // TODO:
  // "gs", // TODO:
]);

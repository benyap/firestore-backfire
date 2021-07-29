import { resolve } from "path";
import * as admin from "firebase-admin";

import type { Config } from "../types";

/**
 * Creates the credentials for connecting to Firebase using either
 * `config.keyfile` or `config.emulator`.
 *
 * If `config.keyfile` is provided, a service account credentials
 * file at `config.keyfile` will be used.
 *
 * If `config.emulator` is provided, the default credentials will
 * be used and the `FIRESTORE_EMULATOR_HOST` environment variable
 * will be set.
 *
 * @param config The program configuration.
 * @returns The Firebase Admin credentials object.
 */
export function createCredentials(config: Config) {
  if (config.emulator) {
    process.env.FIRESTORE_EMULATOR_HOST = config.emulator;
    return admin.credential.applicationDefault();
  }
  const path = resolve(__dirname, "..", "..", config.keyfile!);
  return admin.credential.cert(require(path));
}

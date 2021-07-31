import { resolve } from "path";
import * as admin from "firebase-admin";

/**
 * Creates the credentials for connecting to Firebase using either
 * `keyfile` or `emulator`.
 *
 * If `keyfile` is provided, a service account credentials file at
 * the path given by `keyfile` will be used.
 *
 * If `emulator` is provided, the default credentials will be used
 * and the `FIRESTORE_EMULATOR_HOST` environment variable will be set.
 *
 * If both `keyfile` and `emulator` are provided, the `emulator`
 * configuration takes precedence.
 *
 * @param keyfile The path to a service account credentials file.
 * @param emulator The host and port to use if connecting to Firestore emulator.
 * @returns The Firebase Admin credentials object.
 */
export function createCredentials(options: { keyfile?: string; emulator?: string }) {
  const { keyfile, emulator } = options;
  if (emulator) {
    process.env.FIRESTORE_EMULATOR_HOST = emulator;
    return admin.credential.applicationDefault();
  }
  const path = resolve(__dirname, "..", "..", keyfile!);
  return admin.credential.cert(require(path));
}

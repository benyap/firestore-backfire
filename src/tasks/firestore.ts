import * as admin from "firebase-admin";
import { resolve } from "path";
import root from "app-root-path";

import { IncorrectConfigError } from "../errors";

import type { SharedOptions } from "../types";

/**
 * Create a Firestore instance using the provided credentials.
 *
 * @param projectId The Firebase project id.
 * @param credential The credentials to use for connecting to Firestore.
 * @returns The Firestore instance.
 */
export function createFirestore(
  projectId: string,
  credential: admin.credential.Credential
) {
  const app = admin.initializeApp({ projectId, credential });
  return app.firestore();
}

/**
 * Ensure that either the `keyfile` or `emulator` is provided
 * for connectin to Firestore. If neither option is specified,
 * a `ConfigError` is thrown.
 *
 * @param options The options for the program.
 */
export function ensureFirestoreCredentials(options: SharedOptions) {
  if (!options.emulator && !options.keyfile && !options.credentials) {
    throw new IncorrectConfigError(
      "Either --keyfile or --emulator is required.",
      `Please provide either:
  - a path to the service account credentials file for the project "${options.project}" using --keyfile option, or
  - the emulator host (e.g. localhost:8080) if using Firebase Emulator using the --emulator option`
    );
  }
}

/**
 * Creates the credentials for connecting to Firebase.
 *
 * If `emulator` is provided, the default credentials will be used
 * and the `FIRESTORE_EMULATOR_HOST` environment variable will be set.
 *
 * If `credentials` is provided, the provided credentials will be used
 * directly.
 *
 * If `keyfile` is provided, a service account credentials file at
 * the path given by `keyfile` will be used.
 *
 * @param options The options for the program.
 * @returns The Firebase Admin credentials object.
 */
export function createFirestoreCredentials(options: SharedOptions) {
  const { keyfile, credentials, emulator } = options;

  if (emulator) {
    process.env.FIRESTORE_EMULATOR_HOST = emulator;
    return admin.credential.applicationDefault();
  }

  if (credentials) return admin.credential.cert(credentials);

  const path = resolve(root.toString(), keyfile!);
  return admin.credential.cert(require(path));
}

import * as admin from "firebase-admin";

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

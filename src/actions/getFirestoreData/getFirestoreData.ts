import { FirestoreConnectionOptions, FirestoreFactory } from "~/firestore";

import { GetFirestoreDataOptions } from "./types";

/**
 * Get a document's data from Firestore and return it as stringified JSON.
 *
 * @param connection Specify how to connect to Firestore.
 * @param path Specify the document path to get.
 */
export function getFirestoreData(
  connection: FirestoreConnectionOptions,
  path: string,
  options: { stringify: true | number }
): Promise<string>;

/**
 * Get a document's data from Firestore.
 *
 * @param connection Specify how to connect to Firestore.
 * @param path Specify the document path to get.
 */
export function getFirestoreData(
  connection: FirestoreConnectionOptions,
  path: string,
  options?: { stringify?: false }
): Promise<FirebaseFirestore.DocumentData>;

// Implementation
export async function getFirestoreData(
  connection: FirestoreConnectionOptions,
  path: string,
  options: GetFirestoreDataOptions = {}
) {
  const firestore = FirestoreFactory.create(connection);
  const snapshot = await firestore.doc(path).get();
  const data = snapshot.data();
  const { stringify } = options;
  if (stringify) {
    const indent = typeof stringify === "number" ? stringify : 2;
    return JSON.stringify(data, null, indent);
  } else {
    return data;
  }
}

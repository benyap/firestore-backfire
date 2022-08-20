import { FirestoreConnectionOptions, FirestoreFactory } from "~/firestore";

import { ListFirestoreDataOptions } from "./types";

/**
 * Count the number of documents at the specified path in Firestore.
 *
 * @param connection Specify how to connect to Firestore.
 * @param path Specify the path to the collection to count documents in.
 */
export function listFirestoreDocuments(
  connection: FirestoreConnectionOptions,
  path: string,
  options: { count: true }
): Promise<number>;

/**
 * List the documents at the specified path in Firestore.
 *
 * @param connection Specify how to connect to Firestore.
 * @param path Specify the path to the collection to list documents in.
 */
export function listFirestoreDocuments(
  connection: FirestoreConnectionOptions,
  path: string,
  options?: { count?: false; limit?: number }
): Promise<string[]>;

// Implementation
export async function listFirestoreDocuments(
  connection: FirestoreConnectionOptions,
  path: string,
  options: ListFirestoreDataOptions = {}
) {
  const firestore = FirestoreFactory.create(connection);
  const snapshot = await firestore.collection(path).listDocuments();
  if (options.count) return snapshot.length;
  else return snapshot.slice(0, options.limit ?? Infinity).map((doc) => doc.id);
}

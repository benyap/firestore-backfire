import { FirestoreConnectionOptions, FirestoreFactory } from "~/firestore";

import { ListFirestoreDataOptions } from "./types";

/**
 * Count the number of collections at the specified path in Firestore.
 *
 * @param connection Specify how to connect to Firestore.
 * @param path Specify the path to the document to count subcollections in. Pass an empty value to count root collections.
 */
export function listFirestoreCollections(
  connection: FirestoreConnectionOptions,
  path: string | undefined | null,
  options: { count: true }
): Promise<number>;

/**
 * List the collections at the specified path in Firestore.
 *
 * @param connection Specify how to connect to Firestore.
 * @param path Specify the path to the document to list subcollections in. Pass an empty value to list root collections.
 */
export function listFirestoreCollections(
  connection: FirestoreConnectionOptions,
  path: string | undefined | null,
  options?: { count?: false; limit?: number }
): Promise<string[]>;

// Implementation
export async function listFirestoreCollections(
  connection: FirestoreConnectionOptions,
  path: string | undefined | null,
  options: ListFirestoreDataOptions = {}
) {
  const firestore = FirestoreFactory.create(connection);
  const ref = path ? firestore.doc(path) : firestore;
  const snapshot = await ref.listCollections();
  if (options.count) return snapshot.length;
  else return snapshot.slice(0, options.limit ?? Infinity).map((doc) => doc.id);
}

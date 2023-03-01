import { Firestore } from "@google-cloud/firestore";

import { FirestoreConnectionOptions, FirestoreFactory } from "~/firestore";

/**
 * Count the number of collections at the specified path in Firestore.
 *
 * @param connection Firestore connection options.
 * @param path Specify the path to the document to count subcollections in. Pass an empty value to count root collections.
 */
export async function countFirestoreCollections(
  connection: FirestoreConnectionOptions | Firestore,
  path: string | undefined | null
) {
  const firestore = FirestoreFactory.create(connection);
  const ref = path ? firestore.doc(path) : firestore;
  const snapshot = await ref.listCollections();
  return snapshot.length;
}

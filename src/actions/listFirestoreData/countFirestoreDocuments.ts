import { Firestore } from "@google-cloud/firestore";

import { FirestoreConnectionOptions, FirestoreFactory } from "~/firestore";

/**
 * Count the number of documents at the specified path in Firestore.
 *
 * @param connection Firestore connection options.
 * @param path Specify the path to the collection to count documents in.
 */ export async function countFirestoreDocuments(
  connection: FirestoreConnectionOptions | Firestore,
  path: string,
) {
  const firestore = FirestoreFactory.create(connection);
  const count = await firestore.collection(path).count().get();
  return count.data().count;
}

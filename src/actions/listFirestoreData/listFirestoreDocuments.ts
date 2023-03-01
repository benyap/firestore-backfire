import { Firestore } from "@google-cloud/firestore";

import { FirestoreConnectionOptions, FirestoreFactory } from "~/firestore";

import { ListFirestoreDataOptions } from "./types";

/**
 * List the documents at the specified path in Firestore.
 *
 * @param connection Firestore connection options.
 * @param path Specify the path to the collection to list documents in.
 */
export async function listFirestoreDocuments(
  connection: FirestoreConnectionOptions | Firestore,
  path: string,
  options: ListFirestoreDataOptions = {}
): Promise<string[]> {
  const firestore = FirestoreFactory.create(connection);
  const snapshot = await firestore.collection(path).listDocuments();
  return snapshot.slice(0, options.limit ?? Infinity).map((doc) => doc.id);
}

import { Firestore } from "@google-cloud/firestore";

import { FirestoreConnectionOptions, FirestoreFactory } from "~/firestore";

import { ListFirestoreDataOptions } from "./types";

/**
 * List the collections at the specified path in Firestore.
 *
 * @param connection Firestore connection options.
 * @param path Specify the path to the document to list subcollections in. Pass an empty value to list root collections.
 */
export async function listFirestoreCollections(
  connection: FirestoreConnectionOptions | Firestore,
  path: string | undefined | null,
  options: ListFirestoreDataOptions = {}
): Promise<string[]> {
  const firestore = FirestoreFactory.create(connection);
  const ref = path ? firestore.doc(path) : firestore;
  const snapshot = await ref.listCollections();
  return snapshot.slice(0, options.limit ?? Infinity).map((doc) => doc.id);
}

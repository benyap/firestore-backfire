import { FirestoreConnectionOptions, FirestoreFactory } from "~/firestore";

import { ListFirestoreDataOptions } from "./types";

/**
 * TODO: description
 */
export function listFirestoreDocuments(
  connection: FirestoreConnectionOptions,
  path: string,
  options: { count: true }
): Promise<number>;

/**
 * TODO: description
 */
export function listFirestoreDocuments(
  connection: FirestoreConnectionOptions,
  path: string,
  options?: { count?: false; limit?: number }
): Promise<string[]>;

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

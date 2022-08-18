import { FirestoreConnectionOptions, FirestoreFactory } from "~/firestore";

import { GetFirestoreDataOptions } from "./types";

/**
 * TODO: description
 */
export function getFirestoreData(
  connection: FirestoreConnectionOptions,
  path: string,
  options: { stringify: true | number }
): Promise<string>;

/**
 * TODO: description
 */
export function getFirestoreData(
  connection: FirestoreConnectionOptions,
  path: string,
  options?: { stringify?: false }
): Promise<FirebaseFirestore.DocumentData>;

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

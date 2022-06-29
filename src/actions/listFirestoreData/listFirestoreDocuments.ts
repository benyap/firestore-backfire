import { FirestoreConnectionOptions, FirestoreFactory } from "~/services";
import { FirestoreDataOptions } from "~/actions/types";

export function listFirestoreDocuments(
  connection: FirestoreConnectionOptions,
  path: string,
  options: { count: true }
): Promise<number>;

export function listFirestoreDocuments(
  connection: FirestoreConnectionOptions,
  path: string,
  options?: { count?: false; limit?: number }
): Promise<string[]>;

export async function listFirestoreDocuments(
  connection: FirestoreConnectionOptions,
  path: string,
  options: Pick<FirestoreDataOptions, "limit" | "count"> = {}
) {
  const firestore = FirestoreFactory.create(connection);
  const snapshot = await firestore.collection(path).listDocuments();
  if (options.count) return snapshot.length;
  else return snapshot.slice(0, options.limit ?? Infinity).map((doc) => doc.id);
}

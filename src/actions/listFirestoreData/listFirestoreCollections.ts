import { FirestoreConnectionOptions, FirestoreFactory } from "~/services";
import { FirestoreDataOptions } from "~/actions/types";

export function listFirestoreCollections(
  connection: FirestoreConnectionOptions,
  path: string | undefined | null,
  options: { count: true }
): Promise<number>;

export function listFirestoreCollections(
  connection: FirestoreConnectionOptions,
  path: string | undefined | null,
  options?: { count?: false; limit?: number }
): Promise<string[]>;

export async function listFirestoreCollections(
  connection: FirestoreConnectionOptions,
  path: string | undefined | null,
  options: Pick<FirestoreDataOptions, "limit" | "count"> = {}
) {
  const firestore = FirestoreFactory.create(connection);
  const ref = path ? firestore.doc(path) : firestore;
  const snapshot = await ref.listCollections();
  if (options.count) return snapshot.length;
  else return snapshot.slice(0, options.limit ?? Infinity).map((doc) => doc.id);
}

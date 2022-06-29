import { FirestoreConnectionOptions, FirestoreFactory } from "~/services";
import { FirestoreDataOptions } from "~/actions/types";

export function getFirestoreData(
  connection: FirestoreConnectionOptions,
  path: string,
  options: { stringify: true | number }
): Promise<string>;

export function getFirestoreData(
  connection: FirestoreConnectionOptions,
  path: string,
  options?: { stringify?: false }
): Promise<FirebaseFirestore.DocumentData>;

export async function getFirestoreData(
  connection: FirestoreConnectionOptions,
  path: string,
  options: Pick<FirestoreDataOptions, "stringify"> = {}
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

import type { firestore as Firestore } from "firebase-admin";

/**
 * Get a list of all root collection references.
 *
 * @param firestore The Firestore instance.
 * @returns Root collection references.
 */
export async function listCollections(firestore: ReturnType<typeof Firestore>) {
  return await firestore.listCollections();
}

/**
 * Get a list of all root collection ids.
 *
 * @param firestore The Firestore instance.
 * @returns Root collection ids.
 */
export async function listCollectionIds(firestore: ReturnType<typeof Firestore>) {
  const collections = await listCollections(firestore);
  return collections.map((collection) => collection.id);
}

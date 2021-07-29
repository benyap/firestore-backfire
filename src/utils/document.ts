import type { DocumentMessage, SerializedFirestoreDocument } from "../types";

/**
 * Serialize a Firestore document message as a string to be saved.
 *
 * @param message The document to serialize.
 * @returns The document serialized as a string.
 */
export function serializeDocument(message: DocumentMessage) {
  const document: SerializedFirestoreDocument = {
    path: message.path,
    data: message.data,
  };
  return JSON.stringify(document);
}

/**
 * Unserialize a Firestore document message.
 *
 * @param data The serialized document string.
 * @returns The unserailized document data.
 */
export function unserializeDocument(data: string) {
  const document = JSON.parse(data) as SerializedFirestoreDocument;
  //
  // TODO: parse Timestamp / Geopoint / Reference objects
  //
  return document;
}

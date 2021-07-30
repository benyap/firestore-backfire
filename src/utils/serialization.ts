import type { DocumentMessage, SerializedFirestoreDocument } from "../types";

import { findFirestoreFields } from "./firestore";

/**
 * Serialize a Firestore document message as a string to be saved.
 *
 * @param message The document to serialize.
 * @param number If provided, serialized document will be pretty-printed with the specified indent.
 * @returns The document serialized as a string.
 */
export function serializeDocument(message: DocumentMessage, indent?: number) {
  const document: SerializedFirestoreDocument = {
    path: message.path,
    data: message.data,
  };

  const { timestamps, geopoints, references } = findFirestoreFields(message.data);

  if (timestamps.length > 0) document.timestamps = timestamps;
  if (geopoints.length > 0) document.geopoints = geopoints;
  if (references.length > 0) document.references = references;

  return JSON.stringify(document, null, indent);
}

/**
 * Unserialize a Firestore document message.
 *
 * @param data The serialized document string.
 * @returns The unserialized document data.
 */
export function unserializeDocument(data: string) {
  const document = JSON.parse(data) as SerializedFirestoreDocument;

  if (document.timestamps) {
    // TODO:
  }

  if (document.geopoints) {
    // TODO:
  }

  if (document.references) {
    // TODO:
  }

  return document;
}

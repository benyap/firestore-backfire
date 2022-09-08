import { Firestore } from "@google-cloud/firestore";

import { serializeDocument } from "./serialize";
import { deserializeDocument } from "./deserialize";
import {
  SerializedFirestoreDocument,
  DeserializedFirestoreDocument,
} from "./types";

/**
 * Provides static methods to serialize Firestore documents to JSON and vice versa.
 */
export class FirestoreDocument {
  /**
   * Serialize a Firestore document message as a string to be saved.
   *
   * @param path The path of the document to serialize.
   * @param data The document data to serialize.
   * @returns The serialized document, or `null` if `data` was not a valid document.
   */
  static serialize(
    path: string,
    data: unknown
  ): SerializedFirestoreDocument | null {
    return serializeDocument(path, data);
  }

  /**
   * Deserialize a serialized Firestore document.
   *
   * A serialized Firestore document is a Firestore document converted into JSON.
   *
   * @param document The serialized document.
   * @param firestore The current Firestore instance.
   * @returns The deserialized document data.
   */
  static deserialize(
    document: Partial<SerializedFirestoreDocument>,
    firestore: Firestore
  ): DeserializedFirestoreDocument {
    return deserializeDocument(document, firestore);
  }
}

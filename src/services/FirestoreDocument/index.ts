import { Firestore } from "@google-cloud/firestore";

import { DeserializedFirestoreDocument } from "./types";

import { serializeDocument } from "./serialize";
import { deserializeDocuments } from "./deserialize";

export class FirestoreDocument {
  static serialize(path: string, data: any, indent?: number): string {
    return serializeDocument(path, data, indent);
  }

  static deserialize(
    data: string,
    firestore: Firestore
  ): DeserializedFirestoreDocument[] {
    return deserializeDocuments(data, firestore);
  }
}

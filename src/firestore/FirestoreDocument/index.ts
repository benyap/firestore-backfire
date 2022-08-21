import { Firestore } from "@google-cloud/firestore";

import { DeserializedFirestoreDocument } from "./types";

import { serializeDocument } from "./serialize";
import { deserializeDocument } from "./deserialize";

export class FirestoreDocument {
  static serialize(
    path: string,
    data: unknown,
    indent?: number
  ): string | null {
    return serializeDocument(path, data, indent);
  }

  static deserialize(
    data: object,
    firestore: Firestore
  ): DeserializedFirestoreDocument {
    return deserializeDocument(data, firestore);
  }
}

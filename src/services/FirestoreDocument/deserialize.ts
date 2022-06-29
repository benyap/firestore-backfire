import {
  Firestore,
  Timestamp,
  GeoPoint,
  DocumentReference,
  CollectionReference,
  Query,
} from "@google-cloud/firestore";
import { EError } from "exceptional-errors";

import {
  DeserializedFirestoreDocument,
  SerializedFirestoreDocument,
  SerializedTimestamp,
  SerializedGeoPoint,
  SerializedDocumentReference,
  SerializedQuery,
  FirestoreProtoValueDefinition,
  FirestoreProtoValue,
} from "./types";

import { getValueByPath, NDJSON, setValueByPath } from "~/utils";

export class DeserializationError extends EError {}

/**
 * Deserialize a Firestore document message.
 *
 * @param data The serialized documents (JSON or JSON string form).
 * @param firestore The current Firestore instance.
 * @param mode The mode the input data is in.
 * @returns The unserialized document data.
 */
export function deserializeDocuments(
  data: string,
  firestore: Firestore,
  mode: "json" | "ndjson" = "json"
): DeserializedFirestoreDocument[] {
  try {
    let documents: SerializedFirestoreDocument[];

    switch (mode) {
      case "json":
        documents = JSON.parse(data);
        break;
      case "ndjson":
        documents = NDJSON.parse<SerializedFirestoreDocument>(data);
        break;
      default:
        throw new DeserializationError("invalid deserialization mode", {
          info: { mode },
        });
    }

    documents.forEach((document) => {
      if (document.timestamps) {
        for (const path of document.timestamps) {
          const data = getValueByPath<SerializedTimestamp>(document.data, path);
          setValueByPath(
            document.data,
            path,
            deserializeFirestoreTimestamp(data)
          );
        }
      }

      if (document.geopoints) {
        for (const path of document.geopoints) {
          const data = getValueByPath<SerializedGeoPoint>(document.data, path);
          setValueByPath(
            document.data,
            path,
            deserializeFirestoreGeopoint(data)
          );
        }
      }

      if (document.documents) {
        for (const path of document.documents) {
          const data =
            getValueByPath<SerializedDocumentReference>(document.data, path) ??
            {};
          setValueByPath(
            document.data,
            path,
            deserializeFirestoreDocumentReference(firestore, data)
          );
        }
      }

      if (document.queries) {
        for (const path of document.queries) {
          const data =
            getValueByPath<SerializedQuery>(document.data, path) ?? {};
          setValueByPath(
            document.data,
            path,
            deserializeFirestoreQuery(firestore, data)
          );
        }
      }
    });

    return documents;
  } catch (cause: any) {
    throw new DeserializationError("error deserializing document", {
      cause,
      info: { data },
    });
  }
}

/**
 * Deserialize a Firestore Timestamp object.
 *
 * @param data The data to deserialize.
 * @returns The deserialized object if it was valid, `null` otherwise.
 */
function deserializeFirestoreTimestamp(
  data?: Partial<SerializedTimestamp>
): Timestamp | null {
  const { _seconds, _nanoseconds } = data ?? {};
  if (_seconds !== undefined && _nanoseconds !== undefined)
    return new Timestamp(_seconds, _nanoseconds);
  return null;
}

/**
 * Deserialize a Firestore Geopoint object.
 *
 * @param data The data to deserialize.
 * @returns The deserialized object if it was valid, `null` otherwise.
 */
function deserializeFirestoreGeopoint(
  data?: Partial<SerializedGeoPoint>
): GeoPoint | null {
  const { _latitude, _longitude } = data ?? {};
  if (_latitude !== undefined && _longitude !== undefined)
    return new GeoPoint(_latitude, _longitude);
  return null;
}

/**
 * Deserialize a Firestore Document Reference object.
 *
 * @param firestore The current Firestore instance.
 * @param data The data to deserialize.
 * @returns The deserialized object if it was valid. `null` otherwise.
 */
function deserializeFirestoreDocumentReference(
  firestore: Firestore,
  data?: Partial<SerializedDocumentReference>
): DocumentReference | null {
  const { _path } = data ?? {};
  if (_path && _path.segments && _path.segments.length > 0)
    return firestore.doc(_path.segments.join("/"));
  return null;
}

/**
 * Deserialize a Firestore Query object.
 *
 * @param firestore The current Firestore instance.
 * @param data The data to deserialize.
 * @returns The deserialized object if it was value. `null` otherwise.
 */
function deserializeFirestoreQuery(
  firestore: Firestore,
  data?: Partial<SerializedQuery>
): Query | CollectionReference | null {
  if (!data?._queryOptions) return null;

  const {
    parentPath,
    collectionId,
    fieldFilters = [],
    fieldOrders = [],
    startAt,
    endAt,
    limit,
    limitType,
    offset,
  } = data._queryOptions;

  const path = `${parentPath.segments.join("/")}/${collectionId}`;
  let ref: Query = firestore.collection(path);

  fieldFilters.forEach(({ field, op, value }) => {
    if (op === "OPERATOR_UNSPECIFIED") return;
    const path = field.segments.join(".");
    switch (op) {
      case "ARRAY_CONTAINS":
        ref = ref.where(path, "array-contains", value);
        break;
      case "ARRAY_CONTAINS_ANY":
        ref = ref.where(path, "array-contains-any", value);
        break;
      case "EQUAL":
        ref = ref.where(path, "==", value);
        break;
      case "GREATER_THAN":
        ref = ref.where(path, ">", value);
        break;
      case "GREATER_THAN_OR_EQUAL":
        ref = ref.where(path, ">=", value);
        break;
      case "IN":
        ref = ref.where(path, "in", value);
        break;
      case "LESS_THAN":
        ref = ref.where(path, "<", value);
        break;
      case "LESS_THAN_OR_EQUAL":
        ref = ref.where(path, "<=", value);
        break;
      case "NOT_EQUAL":
        ref = ref.where(path, "!=", value);
        break;
      case "NOT_IN":
        ref = ref.where(path, "not-in", value);
        break;
    }
  });

  fieldOrders.forEach(({ field, direction }) => {
    if (direction === "DIRECTION_UNSPECIFIED") return;
    ref = ref.orderBy(
      field.segments.join("."),
      direction === "ASCENDING" ? "asc" : "desc"
    );
  });

  if (startAt) {
    const values = startAt.values.map((v) => _deserializeFirestoreValue(v));
    if (startAt.before) ref = ref.startAt(...values);
    else ref = ref.startAfter(...values);
  }

  if (endAt) {
    const values = endAt.values.map((v) => _deserializeFirestoreValue(v));
    if (endAt.before) ref = ref.endBefore(...values);
    else ref = ref.endAt(...values);
  }

  if (typeof limit === "number" && typeof limitType === "number") {
    if (limitType === 0) ref = ref.limit(limit);
    else ref = ref.limitToLast(limit);
  }

  if (typeof offset === "number") {
    ref = ref.offset(offset);
  }

  return ref;
}

/**
 * Deserialize a protobuf definition value.
 */
function _deserializeFirestoreValue(
  value: FirestoreProtoValueDefinition
): FirestoreProtoValue {
  if ("nullValue" in value) return null;
  if ("booleanValue" in value) return value.booleanValue ?? null;
  if ("integerValue" in value) return value.integerValue ?? null;
  if ("doubleValue" in value) return value.doubleValue ?? null;
  if ("timestampValue" in value) {
    const { seconds, nanos } = value.timestampValue ?? {};
    if (typeof seconds !== "number" || typeof nanos !== "number") return null;
    return new Timestamp(seconds, nanos);
  }
  if ("stringValue" in value) return value.stringValue ?? null;
  if ("bytesValue" in value) return value.bytesValue ?? null;
  if ("referenceValue" in value) return value.referenceValue ?? null;
  if ("geoPointValue" in value) {
    const { latitude, longitude } = value.geoPointValue ?? {};
    if (typeof latitude !== "number" || typeof longitude !== "number")
      return null;
    return new GeoPoint(latitude, longitude);
  }
  if ("arrayValue" in value) {
    const { values = [] } = value.arrayValue ?? {};
    return values?.map((v) => _deserializeFirestoreValue(v)) ?? null;
  }
  if ("mapValue" in value) {
    const { fields } = value.mapValue ?? {};
    if (!fields) return null;
    return Object.keys(fields).reduce((object, field) => {
      object[field] = _deserializeFirestoreValue(fields[field]!);
      return object;
    }, {} as { [key: string]: any });
  }
  return null;
}

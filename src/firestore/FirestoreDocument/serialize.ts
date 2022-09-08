import { SerializedFirestoreDocument } from "./types";
import {
  isFirestoreDocumentReference,
  isFirestoreGeoPoint,
  isFirestoreQuery,
  isFirestoreTimestamp,
} from "./utils";

import { deleteFieldByPath } from "~/utils";

/**
 * Serialize a Firestore document into JSON.
 *
 * @param path The path of the document to serialize.
 * @param data The document data to serialize.
 * @returns The serialized document, or `null` if `data` was not a valid document.
 */
export function serializeDocument(
  path: string,
  data: unknown
): SerializedFirestoreDocument | null {
  const json = toJSON(data);
  const document: SerializedFirestoreDocument = { path, data: json };

  // Return `null` for any non-object values
  if (json === null || typeof json !== "object") return null;

  const { timestamps, geopoints, documents, queries } =
    findFirestoreFields(json);

  // Strip unecessary fields from Firestore objects
  documents.forEach((path) => {
    deleteFieldByPath(json, `${path}._firestore`);
    deleteFieldByPath(json, `${path}._converter`);
  });
  queries.forEach((path) => {
    deleteFieldByPath(json, `${path}._firestore`);
    deleteFieldByPath(json, `${path}._serializer`);
    deleteFieldByPath(json, `${path}._allowUndefined`);
    deleteFieldByPath(json, `${path}._queryOptions.allDescendants`);
    deleteFieldByPath(json, `${path}._queryOptions.converter`);
    deleteFieldByPath(json, `${path}._queryOptions.fieldFilters.*.serializer`);
    deleteFieldByPath(json, `${path}._queryOptions.kindless`);
    deleteFieldByPath(json, `${path}._queryOptions.projection`);
    deleteFieldByPath(json, `${path}._queryOptions.requireConsistency`);
  });

  // Add field paths to document
  if (timestamps.length > 0) document.timestamps = timestamps;
  if (geopoints.length > 0) document.geopoints = geopoints;
  if (documents.length > 0) document.documents = documents;
  if (queries.length > 0) document.queries = queries;

  return document;
}

function toJSON(object: any) {
  let output: any;

  if (Array.isArray(object)) output = [...object];
  else output = { ...object };

  for (const key in output) {
    const value = output[key];
    if (typeof value !== "object") continue;
    output[key] = toJSON(value);
  }

  return output;
}

/**
 * Recursively checks through the values of an object and
 * returns the paths of any Firestore values it finds.
 *
 * @param object The object to search.
 * @param path The current path in an object. Do not use for top level objects.
 * @returns The paths to any Timestamp, GeoPoint or DocumentReference fields in the object.
 */
function findFirestoreFields(
  object: { [key: string]: any },
  path: string[] = []
) {
  let timestamps: string[] = [];
  let geopoints: string[] = [];
  let documents: string[] = [];
  let queries: string[] = [];

  Object.keys(object).forEach((field) => {
    const data = object[field];

    // Skip null/undefined values
    if (data === null || typeof data === "undefined") return;

    // Check objects
    if (typeof data === "object") {
      // Check if properties match a Firestore field
      if (isFirestoreTimestamp(data)) {
        timestamps.push([...path, field].join("."));
      } else if (isFirestoreGeoPoint(data)) {
        geopoints.push([...path, field].join("."));
      } else if (isFirestoreDocumentReference(data)) {
        documents.push([...path, field].join("."));
      } else if (isFirestoreQuery(data)) {
        queries.push([...path, field].join("."));
      }

      // Otherwise, check object fields
      else if (typeof data === "object") {
        const result = findFirestoreFields(data, [...path, field]);
        timestamps = timestamps.concat(result.timestamps);
        geopoints = geopoints.concat(result.geopoints);
        documents = documents.concat(result.documents);
        queries = queries.concat(result.queries);
      }
    }
  });

  return { timestamps, geopoints, documents, queries };
}

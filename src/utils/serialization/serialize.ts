import {
  Timestamp,
  GeoPoint,
  DocumentReference,
  Query,
} from "@google-cloud/firestore";

import { SerializedFirestoreDocument } from "~/types";

import { deleteFieldByPath } from "../objectPath";

/**
 * Serialize a Firestore document message as a string to be saved.
 *
 * @param doc The document to serialize.
 * @param number If provided, serialized document will be pretty-printed with the specified indent.
 * @returns The document serialized as a string.
 */
export function serializeDocument(
  doc: SerializedFirestoreDocument,
  indent?: number
) {
  const document: SerializedFirestoreDocument = {
    path: doc.path,
    data: doc.data,
  };

  const { timestamps, geopoints, documents, queries } = findFirestoreFields(
    doc.data
  );

  // Strip unecessary fields from Firestore objects
  documents.forEach((path) => {
    deleteFieldByPath(doc.data, `${path}._converter`);
  });
  queries.forEach((path) => {
    deleteFieldByPath(doc.data, `${path}._queryOptions.converter`);
    deleteFieldByPath(doc.data, `${path}._queryOptions.allDescendants`);
    deleteFieldByPath(doc.data, `${path}._queryOptions.kindless`);
    deleteFieldByPath(doc.data, `${path}._queryOptions.requireConsistency`);
    deleteFieldByPath(doc.data, `${path}._serializer`);
    deleteFieldByPath(doc.data, `${path}._allowUndefined`);
  });

  // Add field paths to document
  if (timestamps.length > 0) document.timestamps = timestamps;
  if (geopoints.length > 0) document.geopoints = geopoints;
  if (documents.length > 0) document.documents = documents;
  if (queries.length > 0) document.queries = queries;

  return JSON.stringify(document, null, indent);
}

/**
 * Recursively checks through the values of an object and
 * returns the paths of any Firestore values it finds.
 *
 * @param object The object to search.
 * @param path The current path in an object. Do not use for top level objects.
 * @returns The paths to any Timestamp, GeoPoint or DocumentReference fields in the object.
 */
function findFirestoreFields(object: { [key: string]: any }, path: string[] = []) {
  let timestamps: string[] = [];
  let geopoints: string[] = [];
  let documents: string[] = [];
  let queries: string[] = [];

  Object.keys(object).forEach((field) => {
    const data = object[field];

    // Skip null values
    if (data === null) return;

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

/**
 * Checks whether an object is a Firestore Timestamp.
 *
 * // HACK: current implementation just checks for existence of
 * the "_seconds" and "_nanoseconds" fields. Does not guarantee
 * that it is actually a Timestamp instance.
 *
 * @param object The object to check.
 * @returns `true` if the object is a Firestore Timestamp.
 */
function isFirestoreTimestamp(object: any): object is Timestamp {
  if (typeof object === "object")
    return "_seconds" in object && "_nanoseconds" in object;
  return false;
}

/**
 * Checks whether an object is a Firestore GeoPoint.
 *
 * // HACK: current implementation just checks for existence of
 * the "_latitude" and "_longitude" fields. Does not guarantee
 * that it is actually a GeoPoint instance.
 *
 * @param object The object to check.
 * @returns `true` if the object is a Firestore GeoPoint.
 */
function isFirestoreGeoPoint(object: any): object is GeoPoint {
  if (typeof object === "object")
    return "_latitude" in object && "_longitude" in object;
  return false;
}

/**
 * Checks whether an object is a Firestore Document Reference.
 *
 * // HACK: current implementation just checks for existence of
 * the "_firestore" and "_path" fields. Does not guarantee
 * that it is actually a DocumentReference instance.
 *
 * @param object The object to check.
 * @returns `true` if the object is a Firestore DocumentReference.
 */
function isFirestoreDocumentReference(object: any): object is DocumentReference {
  if (typeof object === "object") return "_firestore" in object && "_path" in object;
  return false;
}

/**
 * Checks whether an object is a Firestore Query.
 *
 * // HACK: current implementation just checks for existence of
 * the "_firestore" and "_queryOptions" fields. Does not guarantee
 * that it is actually a Query instance.
 *
 * @param object THe object to check.
 * @returns `true` if the object is a Firestore Query.
 */
function isFirestoreQuery(object: any): object is Query {
  if (typeof object === "object")
    return "_firestore" in object && "_queryOptions" in object;
  return false;
}

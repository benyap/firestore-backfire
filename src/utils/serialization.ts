import { Timestamp, GeoPoint, DocumentReference } from "@google-cloud/firestore";
import { firestore } from "firebase-admin";

import {
  DeserializedFirestoreDocument,
  DocumentMessage,
  SerializedFirestoreDocument,
  SerializedGeoPoint,
  SerializedReference,
  SerializedTimestamp,
} from "../types";

import { getValueByPath, setValueByPath } from "./valueByPath";

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
 * Deserialize a Firestore document message.
 *
 * @param data The serialized document string.
 * @returns The unserialized document data.
 */
export function deserializeDocuments(data: string): DeserializedFirestoreDocument[] {
  try {
    const parsed = JSON.parse(data) as
      | SerializedFirestoreDocument
      | SerializedFirestoreDocument[];

    const documents = Array.isArray(parsed) ? parsed : [parsed];

    documents.forEach((document) => {
      if (document.timestamps) {
        // Deserialize timestamp objects
        for (const path of document.timestamps) {
          const data = getValueByPath<SerializedTimestamp>(document.data, path);
          setValueByPath(document.data, path, deserializeFirestoreTimestamp(data));
        }
      }

      if (document.geopoints) {
        // Deserialize geopoint objects
        for (const path of document.geopoints) {
          const data = getValueByPath<SerializedGeoPoint>(document.data, path);
          setValueByPath(document.data, path, deserializeFirestoreGeopoint(data));
        }
      }

      if (document.references) {
        for (const path of document.references) {
          // Deserialize document reference objects
          const data =
            getValueByPath<SerializedReference>(document.data, path) ?? {};
          setValueByPath(
            document.data,
            path,
            deserializeFirestoreDocumentReference(data)
          );
        }
      }
    });

    return documents;
  } catch (error) {
    console.error(data);
    throw error;
  }
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
  let references: string[] = [];

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
        references.push([...path, field].join("."));
      }

      // Otherwise, check object fields
      else if (typeof data === "object") {
        const result = findFirestoreFields(data, [...path, field]);
        timestamps = [...timestamps, ...result.timestamps];
        geopoints = [...geopoints, ...result.geopoints];
        references = [...references, ...result.references];
      }
    }
  });

  return { timestamps, geopoints, references };
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
 * Deserialize a Firestore Timestamp object.
 *
 * @param data The data to deserialize.
 * @returns The deserialized object if it was valid, `null` otherwise.
 */
function deserializeFirestoreTimestamp(data?: Partial<SerializedTimestamp>) {
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
function deserializeFirestoreGeopoint(data?: Partial<SerializedGeoPoint>) {
  const { _latitude, _longitude } = data ?? {};
  if (_latitude !== undefined && _longitude !== undefined)
    return new GeoPoint(_latitude, _longitude);
  return null;
}

/**
 * Deserialize a Firestore Document Reference object.
 *
 * @param data The data to deserialize.
 * @returns The deserialized object if it was valid, `null` otherwise.
 */
function deserializeFirestoreDocumentReference(data?: Partial<SerializedReference>) {
  const { _path } = data ?? {};
  if (_path && _path.segments && _path.segments.length > 0)
    return firestore().doc(_path.segments.join("/"));
  return null;
}

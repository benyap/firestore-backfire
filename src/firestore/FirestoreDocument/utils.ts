import {
  GeoPoint,
  Query,
  DocumentReference,
  Timestamp,
} from "@google-cloud/firestore";

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
export function isFirestoreTimestamp(object: any): object is Timestamp {
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
export function isFirestoreGeoPoint(object: any): object is GeoPoint {
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
export function isFirestoreDocumentReference(
  object: any,
): object is DocumentReference {
  if (typeof object === "object")
    return "_firestore" in object && "_path" in object;
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
export function isFirestoreQuery(object: any): object is Query {
  if (typeof object === "object")
    return "_firestore" in object && "_queryOptions" in object;
  return false;
}

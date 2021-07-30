import { Timestamp, GeoPoint, DocumentReference } from "@google-cloud/firestore";

/**
 * Recursively checks through the values of an object and
 * returns the paths of any Firestore values it finds.
 *
 * @param object The object to search.
 * @param path The current path in an object. Do not use for top level objects.
 * @returns The paths to any Timestamp, GeoPoint or DocumentReference fields in the object.
 */
export function findFirestoreFields(
  object: { [key: string]: any },
  path: string[] = []
) {
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

/**
 * Get a value in an object by path.
 *
 * @param object The object to get the value from in.
 * @param path The path of the value to get.
 * @returns The value at the path, or `undefined` if it does not exist.
 */
export function getValueByPath<T = any>(
  object: { [key: string]: any },
  path: string | string[]
): T | undefined {
  // Get path segments
  const segments = Array.isArray(path) ? path : path.split(".");
  const field = segments.shift();

  if (typeof field !== "string" || !object) return undefined;

  // If are no more segments, that means we reached the destination
  if (segments.length === 0) return object[field];

  // Get the rest of the path recursively
  return getValueByPath(object[field], segments);
}

/**
 * Set the value in an object by path. If the path does not
 * exist and `createMissingKeys` set to `false`, the object
 * will not be modified.
 *
 * @param object The object to set the value in.
 * @param path The path in the object to set.
 * @param value The value to set.
 * @param options.createMissingKeys Create missing keys in the path. Defaults to `true`.
 * @returns The udpated object.
 */
export function setValueByPath<T>(
  object: { [key: string]: any },
  path: string | string[],
  value: T,
  options: { createMissingKeys?: boolean } = {}
) {
  const { createMissingKeys = true } = options;

  // Get path segments
  const segments = Array.isArray(path) ? path : path.split(".");
  const field = segments.shift();

  if (typeof field !== "string" || !object) return object;

  // If are no more segments, that means we reached the destination
  if (segments.length === 0) {
    if (createMissingKeys || field in object) object[field] = value;
    return object;
  }

  // Otherwise check if the path we want to follow exists
  // If it doesn't, we either create the path or abort
  if (!(field in object)) {
    if (createMissingKeys) object[field] = {};
    else return object;
  }

  // Set the rest of the path recursively
  setValueByPath(object[field], segments, value);

  return object;
}

/**
 * Delete a field in an object using by path. If the path does
 * not exist, the object will not be modified.
 *
 * @param object The object to delete the field from.
 * @param path The path to the field to delete.
 * @returns The updated object.
 */
export function deleteFieldByPath(
  object: { [key: string]: any },
  path: string | string[]
) {
  // Get path segments
  const segments = Array.isArray(path) ? path : path.split(".");
  const field = segments.shift();

  if (typeof field !== "string" || !object) return object;

  // If there are no more segments, it means we reached the destination
  if (segments.length === 0) {
    delete object[field];
    return object;
  }

  // Follow the path if it exists
  if (field in object) deleteFieldByPath(object[field], segments);

  return object;
}

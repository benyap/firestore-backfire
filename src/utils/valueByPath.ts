/**
 * Get a value in an object by path.
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
  const segment = segments.shift();

  if (!segment || !object) return undefined;

  // If are no more segments, that means we reached the destination
  if (segments.length === 0) {
    return object[segment];
  }

  // Get the rest of the path recursively
  return getValueByPath(object[segment], segments);
}

/**
 * Set the value in an object by path.
 *
 * @param object The object to set the value in.
 * @param path The path in the object to set.
 * @param value The value to set.
 * @param options.createNonExistentKeys If `true`, non existent keys encountered in the path will be created.
 * @returns The udpated object.
 */
export function setValueByPath<T>(
  object: { [key: string]: any },
  path: string | string[],
  value: T,
  options: { createNonExistentKeys?: boolean } = {}
) {
  // Get path segments
  const segments = Array.isArray(path) ? path : path.split(".");
  const segment = segments.shift();

  if (!segment || !object) return object;

  // If are no more segments, that means we reached the destination
  if (segments.length === 0) {
    object[segment] = value;
    return object;
  }

  // Otherwise, check if the path we want to follow exists
  if (typeof object[segment] === "undefined") {
    if (options.createNonExistentKeys) object[segment] = {};
    else return object;
  }

  // Set the rest of the path recursively
  setValueByPath(object[segment], segments, value);

  return object;
}

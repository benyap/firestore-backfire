/**
 * Count the number of unique values is found for the specified
 * field in a list of objects. Returns a mapping of the values
 * to the number of times it was found.
 *
 * ASSUMPTION: The values in the specified field can be
 * serialized as strings.
 *
 * @param items The objects to search through.
 * @param field The name of the field to count.
 */
export function countUniqueFieldOccurrences<T extends { [key: string]: any }>(
  items: T[],
  field: keyof T
): Record<string, number> {
  const occurrences: Record<string, number> = {};
  for (const item of items) {
    const value = item[field];
    if (occurrences[value]) occurrences[value] += 1;
    else occurrences[value] = 1;
  }
  return occurrences;
}

/**
 * Redact top level fields of the given object with the string "hidden".
 * If the specified fields do not exist, the object will not be modified.
 *
 * @param object The object to redact.
 * @param fields The fields in the object to redact.
 */
export function redactFields<T extends { [key: string]: any }>(
  object: T,
  ...fields: string[]
): { [key: string]: any } {
  const redactedObject: { [key: string]: any } = { ...object };
  fields
    .filter((field) => field in redactedObject)
    .forEach((field) => (redactedObject[field] = "<hidden>"));
  return redactedObject;
}

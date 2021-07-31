const PROTOCOL_REGEX = /^([^:]+):\/\//;

/**
 * Get a path's protocol. A protocol should be declared by
 * the pattern `protocol://path`. Otherwise, a local file
 * protocol is implied.
 *
 * @param path The path.
 * @returns The file protocol specified by the path.
 */
export function getPathProtocol(path: string) {
  if (PROTOCOL_REGEX.test(path)) {
    const [, protocol] = PROTOCOL_REGEX.exec(path)!;
    return protocol!;
  }
  return "file";
}

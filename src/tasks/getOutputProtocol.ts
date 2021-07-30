const PROTOCOL_REGEX = /^([^:]+):\/\//;

/**
 * Get the output file protocol. A protocol should be declared by
 * the pattern `protocol://path`. Otherwise, a local file protocol
 * is implied.
 *
 * @param path The output path.
 * @returns The file protocol specified by the path.
 */
export function getOutuptProtocol(path: string) {
  if (PROTOCOL_REGEX.test(path)) {
    const [, protocol] = PROTOCOL_REGEX.exec(path)!;
    return protocol!;
  }
  return "file";
}

import { Constants } from "../config";
import { UnsupportedOutputPathProtocolError } from "../errors";

const PROTOCOL_REGEX = /^([^:]+):\/\//;

/**
 * Validate an output path to make sure it is supported.
 *
 * @param path The path to validate.
 * @returns The file protocol to use.
 */
export function validateOutputPath(path: string) {
  if (PROTOCOL_REGEX.test(path)) {
    const [, protocol] = PROTOCOL_REGEX.exec(path) ?? [];
    if (!Constants.SUPPORTED_PROTOCOLS.has(protocol))
      throw new UnsupportedOutputPathProtocolError(protocol, path);
    return protocol;
  }
  return "file";
}

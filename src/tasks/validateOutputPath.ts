import { Constants } from "../config";
import { UnsupportedOutputProtocolError } from "../errors";

/**
 * Validate an output protocol to make sure it is supported.
 *
 * @param path The protocol to validate.
 */
export function validateOutputProtocol(protocol: string) {
  if (!Constants.SUPPORTED_PROTOCOLS.has(protocol))
    throw new UnsupportedOutputProtocolError(protocol);
}

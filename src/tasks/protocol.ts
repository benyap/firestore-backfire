import { IncorrectConfigError } from "../errors";
import { LoggingService } from "../logger";
import { StorageProtocol, SUPPORTED_STORAGE_PROTOCOLS } from "../storage";

import type { SharedOptions } from "../types";

const PROTOCOL_REGEX = /^([^:]+):\/\/(.+)/;

/**
 * Get a path's protocol. A protocol should be declared by
 * the pattern `protocol://path`. Otherwise, a local file
 * protocol is implied.
 *
 * @param path The path.
 * @param json If `true`, the "json" file type will be returned if it does not match any external protocols.
 * @returns The file protocol specified by the path.
 */
export function getPathProtocol(path: string, json?: boolean) {
  if (PROTOCOL_REGEX.test(path)) {
    const [, protocol, pathPart] = PROTOCOL_REGEX.exec(path)!;
    return { protocol, path: pathPart };
  }
  return {
    protocol:
      json || path.endsWith(".json")
        ? StorageProtocol.JSONFile
        : StorageProtocol.SnapshotFile,
    path,
  };
}

/**
 * Validate an output protocol to make sure it is supported.
 *
 * @param protocol The protocol to validate.
 * @returns `true` if the protocol is known.
 */
export function validatePathProtocol(protocol: string): protocol is StorageProtocol {
  return SUPPORTED_STORAGE_PROTOCOLS.has(protocol as StorageProtocol);
}

/**
 * Ensure that the required options are provided for a specified protocol.
 *
 * @param protocol The protocol being used.
 * @param options The program options.
 * @param logger A logger to use if there are warnings to print.
 */
export function ensureRequiredProtocolOptions(
  protocol: StorageProtocol,
  options: SharedOptions,
  logger?: LoggingService
) {
  if (protocol !== StorageProtocol.JSONFile && options.json)
    logger?.warn(
      `The --json flag has no effect when using the ${protocol}:// storage protocol.`
    );

  switch (protocol) {
    case StorageProtocol.GoogleCloudStorage:
      if (!options.gcsProject)
        throw new IncorrectConfigError(
          "Google Cloud project id is required.",
          `Please specify a Google Cloud project id using the --gcs-project option, or provide it through a configuration file.`
        );
      if (!options.gcsKeyfile)
        throw new IncorrectConfigError(
          "Path to Google Cloud service account credentials is required.",
          `Please specify a path to a Google Cloud service account credentials file using the --gcs-keyfile option, or provide it through a configuration file.`
        );
      break;
  }
}

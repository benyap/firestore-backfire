import { BackfireError } from "./base";

/**
 * Thrown when an unimplemented storage source is used.
 */
export class UnimplementedStorageSourceTypeError extends BackfireError {
  constructor(public readonly type: string) {
    super(`unimplemented storage source "${type}"`);
  }
}

/**
 * Thrown when an unknown storage source is encountered.
 * @private
 */
export class UnknownStorageSourceTypeError extends BackfireError {
  constructor(public readonly type: string) {
    super(`unknown storage source "${type}"`);
  }
}

/**
 * Thrown when attempting to write to a stream that is not open.
 * @private
 */
export class WriteStreamNotOpenError extends BackfireError {
  constructor(public readonly path: string) {
    super(`write stream to ${path} not open`);
  }
}

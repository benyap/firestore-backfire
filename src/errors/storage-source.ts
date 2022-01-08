import { StorageSourceOptions } from "../services";

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
 * Thrown when the path does not match the required protocol
 * for the specified storage source type.
 */
export class InvalidStorageSourcePathError extends BackfireError {
  constructor(
    public readonly type: StorageSourceOptions["type"],
    public readonly path: string
  ) {
    super(`invalid path for ${type} storage source: ${path}`);
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
 * Thrown when attempting to write to a location that is not empty,
 * which may lead to data loss if the write stream writes to that
 * location.
 */
export class WriteLocationNotEmptyError extends BackfireError {
  constructor(public readonly path: string) {
    super(`write location ${path} is not empty`);
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

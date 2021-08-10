import { ErrorWithDetails } from "../errors";

export class StorageSourceError extends ErrorWithDetails {}

export class UnknownStorageProtocolError extends StorageSourceError {
  constructor(
    public readonly protocol: string,
    message: string = `Unknown storage protocol "${protocol}".`,
    details?: string
  ) {
    super(message, details);
  }
}

export class WriteStreamError extends StorageSourceError {}

export class WriteStreamNotOpenError extends WriteStreamError {
  constructor(path: string) {
    super(`The write stream to ${path} has not been opened.`);
  }
}

export class WriteStreamLocationNotEmpty extends WriteStreamError {
  constructor(path: string) {
    super(`The write stream to ${path} has existing objects.`);
  }
}

export class ReadStreamError extends StorageSourceError {}

export class ReadStreamNotOpenError extends ReadStreamError {
  constructor(path: string) {
    super(`The read stream to ${path} has not been opened.`);
  }
}

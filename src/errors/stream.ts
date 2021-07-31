import { ErrorWithDetails } from "./base";

export class WriteStreamError extends ErrorWithDetails {}

export class WriteStreamOpenError extends WriteStreamError {
  constructor(path: string) {
    super(`The write stream to ${path} is already open.`);
  }
}

export class WriteStreamNotOpenError extends WriteStreamError {
  constructor(path: string) {
    super(`The write stream to ${path} has not been opened.`);
  }
}

export class ReadStreamError extends ErrorWithDetails {}

export class ReadStreamOpenError extends ReadStreamError {
  constructor(path: string) {
    super(`The read stream to ${path} is already open.`);
  }
}

export class ReadStreamNotOpenError extends ReadStreamError {
  constructor(path: string) {
    super(`The read stream to ${path} has not been opened.`);
  }
}

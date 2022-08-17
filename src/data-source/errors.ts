import { EError } from "exceptional-errors";

import { dir } from "~/utils";

export class StreamNotOpenedError extends EError {}
export class DataSourceError extends EError {}

export class DataSourceUnreachableError extends DataSourceError {}
export class DataSourceReaderNotImplementedError extends DataSourceError {}
export class DataSourceWriterNotImplementedError extends DataSourceError {}

export class DataOverwriteError extends DataSourceError {
  constructor(path: string) {
    super(
      `cannot overwrite existing data at ${dir(
        path
      )} unless \`overwrite\` is set to true`
    );
  }
}

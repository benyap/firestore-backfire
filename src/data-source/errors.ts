import { EError } from "exceptional-errors";

import { dir } from "~/utils";

export class DataSourceError extends EError {}
export class ReaderNotOpenedError extends DataSourceError {}
export class WriterNotOpenedError extends DataSourceError {}

export class DataSourceUnreachableError extends DataSourceError {}

export class DataSourceNotImplementedError extends DataSourceError {
  constructor(id: string, type: "reader" | "writer") {
    super(`A ${type} has not been been implemented for data source ${id}`);
  }
}

export class DataOverwriteError extends DataSourceError {
  constructor(path: string) {
    super(
      `cannot overwrite existing data at ${dir(
        path
      )} unless \`overwrite\` is set to true`
    );
  }
}

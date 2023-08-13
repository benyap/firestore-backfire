import { EError } from "exceptional-errors";

import { dir } from "~/utils";

export class DataSourceError extends EError {}

export class DataSourceReaderNotOpenedError extends DataSourceError {}
export class DataSourceWriterNotOpenedError extends DataSourceError {}
export class DataSourceUnreachableError extends DataSourceError {}

export class NoMatchingDataSourceError extends DataSourceError {
  constructor(path: string) {
    super(`No data source available fro path ${path}`);
  }
}

export class DataSourceNotImplementedError extends DataSourceError {
  constructor(id: string, type: "reader" | "writer") {
    super(`A ${type} has not been been implemented for data source ${id}`);
  }
}

export class DataSourceOverwriteError extends DataSourceError {
  constructor(path: string) {
    super(
      `cannot overwrite existing data at ${dir(
        path,
      )} unless \`overwrite\` is set to true`,
    );
  }
}

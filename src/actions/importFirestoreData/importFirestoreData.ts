import { Logger, dir, plural, Timer, b } from "~/utils";
import { FirestoreConnectionOptions } from "~/firestore";
import { IDataSourceReader } from "~/data-source/interface";

// @ts-ignore
import type { SerializedFirestoreDocument } from "~/firestore/FirestoreDocument/types";

import { LoggingOptions } from "../logging";
import { ImportFirestoreDataOptions } from "./types";
import { Importer } from "./Importer";

/**
 * Import documents to Firestore. Data is expected to be in NDJSON format
 * and should follow the {@link SerializedFirestoreDocument} interface.
 *
 * @param connection Specify how to connect to Firestore.
 * @param reader Specify where to read the data to import into Firestore.
 * @param options Specify what data to impor to Firestore.
 */
export async function importFirestoreData(
  connection: FirestoreConnectionOptions,
  reader: IDataSourceReader,
  options: ImportFirestoreDataOptions & LoggingOptions = {}
) {
  const path = dir(reader.path);
  const project = b(connection.project);

  const level = options.quiet
    ? "silent"
    : options.verbose
    ? "verbose"
    : options.debug
    ? "debug"
    : "info";

  const logger = Logger.create("import", level);
  const timer = Timer.start(
    logger.info.bind(logger),
    `Import data from ${path} to ${project}`
  );
  logger.verbose({ options, connection });

  const importer = new Importer(connection, reader, logger);
  const { imported } = await importer.run(options);

  timer.stop(
    `Imported ${plural(imported, "document")} from ${path} to ${project}`
  );
}

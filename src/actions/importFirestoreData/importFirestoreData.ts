import { Logger, dir, plural, Timer, b } from "~/utils";
import { FirestoreConnectionOptions } from "~/firestore";
import { IDataReader } from "~/data-source/interface";

import { ImportFirestoreDataOptions } from "./types";
import { Importer } from "./Importer";

/**
 * TODO: description
 */
export async function importFirestoreData(
  connection: FirestoreConnectionOptions,
  reader: IDataReader,
  options: ImportFirestoreDataOptions = {}
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

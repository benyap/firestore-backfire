import { Firestore } from "@google-cloud/firestore";

import { Logger, dir, plural, Timer, b, TimerInstance } from "~/utils";
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
 * @param connection Firestore connection options.
 * @param reader A data source reader.
 * @param options Import options.
 */
export async function importFirestoreData(
  connection: FirestoreConnectionOptions | Firestore,
  reader: IDataSourceReader,
  options: ImportFirestoreDataOptions & LoggingOptions = {},
) {
  const level = options.quiet
    ? "silent"
    : options.verbose
      ? "verbose"
      : options.debug
        ? "debug"
        : "info";

  const path = dir(reader.path);
  const logger = Logger.create("import", level);
  const log = logger.info.bind(logger);

  let timer: TimerInstance;
  let project = b("<unspecified>");

  if (connection instanceof Firestore) {
    timer = Timer.start(log, `Import data from ${path}`);
    logger.verbose({ options });
  } else {
    if (connection.project) project = b(connection.project);
    timer = Timer.start(log, `Import data from ${path} to ${project}`);
    logger.verbose({ options, connection });
  }

  const importer = new Importer(connection, reader, logger);
  const { imported } = await importer.run(options);

  if (!project)
    timer.stop(`Imported ${plural(imported, "document")} from ${path}`);
  else
    timer.stop(
      `Imported ${plural(imported, "document")} from ${path} to ${project}`,
    );
}

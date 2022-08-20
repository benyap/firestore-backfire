import { Logger, dir, plural, Timer, b } from "~/utils";
import { FirestoreConnectionOptions } from "~/firestore";
import { IDataSourceWriter } from "~/data-source/interface";

// @ts-ignore
import type { SerializedFirestoreDocument } from "~/firestore/FirestoreDocument/types";

import { ExportFirestoreDataOptions } from "./types";
import { Exporter } from "./Exporter";

/**
 * Export documents from Firestore. Documents are serialized using
 * the {@link SerializedFirestoreDocument} interface in NDJSON format.
 *
 * @param connection Specify how to connect to Firestore.
 * @param writer Specify where to export the data from Firestore.
 * @param options Specify what data to export from Firestore.
 */
export async function exportFirestoreData(
  connection: FirestoreConnectionOptions,
  writer: IDataSourceWriter,
  options: ExportFirestoreDataOptions = {}
) {
  const path = dir(writer.path);
  const project = b(connection.project);
  const level = options.quiet
    ? "silent"
    : options.verbose
    ? "verbose"
    : options.debug
    ? "debug"
    : "info";

  const logger = Logger.create("export", level);
  const timer = Timer.start(
    logger.info.bind(logger),
    `Export data from ${project} to ${path}`
  );
  logger.verbose({ options, connection });

  const exporter = new Exporter(connection, writer, logger);
  const { exported } = await exporter.run(options);

  timer.stop(
    `Exported ${plural(exported, "document")} from ${project} to ${path}`
  );
}

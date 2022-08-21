import { Firestore } from "@google-cloud/firestore";

import { Logger, dir, plural, Timer, b, TimerInstance } from "~/utils";
import { FirestoreConnectionOptions } from "~/firestore";
import { IDataSourceWriter } from "~/data-source/interface";

// @ts-ignore
import type { SerializedFirestoreDocument } from "~/firestore/FirestoreDocument/types";

import { LoggingOptions } from "../logging";
import { ExportFirestoreDataOptions } from "./types";
import { Exporter } from "./Exporter";

/**
 * Export documents from Firestore. Documents are serialized using
 * the {@link SerializedFirestoreDocument} interface in NDJSON format.
 *
 * @param connection Firestore connection options.
 * @param writer A data source writer.
 * @param options Export options.
 */
export async function exportFirestoreData(
  connection: FirestoreConnectionOptions | Firestore,
  writer: IDataSourceWriter,
  options: ExportFirestoreDataOptions & LoggingOptions = {}
) {
  const level = options.quiet
    ? "silent"
    : options.verbose
    ? "verbose"
    : options.debug
    ? "debug"
    : "info";
  const path = dir(writer.path);
  const logger = Logger.create("export", level);
  const log = logger.info.bind(logger);

  let timer: TimerInstance;
  let project = b("<unspecified>");

  if (connection instanceof Firestore) {
    timer = Timer.start(log, `Export data to ${path}`);
    logger.verbose({ options });
  } else {
    if (connection.project) project = b(connection.project);
    timer = Timer.start(log, `Export data from ${project} to ${path}`);
    logger.verbose({ options, connection });
  }

  const exporter = new Exporter(connection, writer, logger);
  const { exported } = await exporter.run(options);

  if (!project)
    timer.stop(`Exported ${plural(exported, "document")} to ${path}`);
  else
    timer.stop(
      `Exported ${plural(exported, "document")} from ${project} to ${path}`
    );
}

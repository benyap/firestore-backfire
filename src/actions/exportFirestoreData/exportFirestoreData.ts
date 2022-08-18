import { Logger, dir, plural, Timer, b } from "~/utils";
import { FirestoreConnectionOptions } from "~/firestore";
import { IDataWriter } from "~/data-source/interface";

import { ExportFirestoreDataOptions } from "./types";
import { Exporter } from "./Exporter";

/**
 * TODO: description
 */
export async function exportFirestoreData(
  connection: FirestoreConnectionOptions,
  writer: IDataWriter,
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

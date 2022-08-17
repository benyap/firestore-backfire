import { Logger, dir as p, plural, Timer } from "~/utils";
import { FirestoreConnectionOptions } from "~/services";
import { IDataOutput } from "~/data-source/interface";

import { ExportFirestoreDataOptions } from "./types";
import { Exporter } from "./Exporter";

export async function exportFirestoreData(
  connection: FirestoreConnectionOptions,
  output: IDataOutput,
  options: ExportFirestoreDataOptions = {}
) {
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
    `Exporting data to ${p(output.destination)}`
  );
  logger.debug({ options, connection });

  const exporter = new Exporter(connection, output, logger);
  const count = await exporter.run(options);

  timer.stop(
    `Exported ${plural(count.val, "document")} to ${p(output.destination)}`
  );
}

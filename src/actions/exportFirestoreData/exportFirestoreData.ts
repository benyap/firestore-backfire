import { Logger, dir as p, plural, Timer } from "~/utils";
import { FirestoreConnectionOptions } from "~/services";
import { IDataWriter } from "~/data-source/interface";

import { ExportFirestoreDataOptions } from "./types";
import { Exporter } from "./Exporter";

export async function exportFirestoreData(
  connection: FirestoreConnectionOptions,
  writer: IDataWriter,
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
    `Exporting data to ${p(writer.path)}`
  );
  logger.verbose({ options, connection });

  const overwrite = await writer.open(options.overwrite);
  if (overwrite) logger.debug(`Overwriting existing data at ${p(writer.path)}`);

  const exporter = new Exporter(connection, writer, logger);
  const count = await exporter.run(options);

  timer.stop(`Exported ${plural(count.val, "document")} to ${p(writer.path)}`);
}

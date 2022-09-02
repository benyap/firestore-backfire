import {
  Firestore,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  Query,
} from "@google-cloud/firestore";
import {
  FirestoreConnectionOptions,
  FirestoreDocument,
  FirestoreFactory,
  documentPathDepth,
  isDocumentPath,
} from "~/firestore";
import {
  count,
  dir,
  Logger,
  plural,
  ref as r,
  RepeatedOperation,
  TrackableList,
  TrackableNumber,
  Tracker,
  split,
  Lock,
  y,
  n,
  splitStrict,
} from "~/utils";
import { IDataSourceWriter } from "~/data-source/interface";

import { ExportFirestoreDataOptions as ExportOptions } from "./types";

type Exportable = string | QueryDocumentSnapshot;

export class Exporter {
  private firestore = FirestoreFactory.create(this.connection);

  private writeLock = new Lock();
  private tracker = new Tracker();
  private exploreQueue = new TrackableList<string>(this.tracker);
  private exploring = new TrackableNumber(this.tracker);
  private exporting = new TrackableNumber(this.tracker);
  private exported = new TrackableNumber(this.tracker);
  private exports = new TrackableList<Exportable>(this.tracker);
  private limitReached = false;
  private reads = 0;

  constructor(
    private connection: FirestoreConnectionOptions | Firestore,
    private writer: IDataSourceWriter,
    private logger: Logger
  ) {}

  async run(options: ExportOptions) {
    const {
      paths,
      overwrite,
      update = 5,
      exploreInterval = 10,
      downloadInterval = 1000,
    } = options;

    const overwritten = await this.writer.open(overwrite);
    if (overwritten)
      this.logger.debug(
        `Overwriting existing data at ${dir(this.writer.path)}`
      );

    // Get starting paths to explore
    if (paths) {
      this.exploreQueue.set(paths);
      this.exports.set(paths);
    } else {
      const collections = await this.firestore.listCollections();
      this.exploreQueue.set(collections.map((col) => col.path));
    }

    // Explore data paths in Firestore
    const explore = new RepeatedOperation({
      interval: exploreInterval,
      when: () => this.exploreQueue.length > 0,
      until: () =>
        (this.exploreQueue.length === 0 &&
          this.exploring.val === 0 &&
          !this.writeLock.locked) ||
        this.limitReached,
      action: () => this.exploreAction(options),
    });

    // Download data from Firestore and export it
    const download = new RepeatedOperation({
      interval: downloadInterval,
      when: () => this.exports.length > 0,
      until: () =>
        ((this.exploreQueue.length === 0 &&
          this.exploring.val === 0 &&
          this.exports.length === 0) ||
          this.limitReached) &&
        this.exporting.val === 0 &&
        !this.writeLock.locked,
      action: () => this.downloadAction(options),
      onDone: () => explore.abort(),
    });

    // Log status every few seconds
    const log = new RepeatedOperation({
      when: () => this.tracker.touched(),
      until: () => this.exploreQueue.length === 0 && this.exploring.val === 0,
      interval: update * 1000,
      action: () => this.logStatus("Progress"),
      onDone: () => this.logStatus(),
      onAbort: () => this.logStatus(),
    });

    log.start();
    await Promise.all([explore.start(), download.start()]);
    await this.writer.close();
    log.abort();

    return { exported: this.exported.val };
  }

  private getRemaining(limit: number) {
    const done = this.exported.val + this.exporting.val;
    return Math.max(limit - done, 0);
  }

  private logStatus(prefix?: string) {
    this.logger.debug(
      [
        `${prefix ? `${prefix}: ` : ""}${count(this.exported)} exported`,
        `${count(this.exports)} to export`,
        `${count(this.exploring)} exploring`,
        `${count(this.exploreQueue)} to explore`,
        `${count(this.reads)} reads`,
      ].join(", ")
    );
  }

  /**
   * Explore a chunk of paths from the {@link exploreQueue}.
   *
   * If the path points to a collection, its documents will be added
   * to the queues for export and exploration.
   *
   * If the path points to a document, its subcollections will be added
   * to the queue for exploration. Any paths that exceed the `depth`
   * options are dropped.
   */
  private async exploreAction(options: ExportOptions) {
    const { depth, exploreChunkSize = 1000, limit } = options;

    // Use a lock here so that `exploreQueue` and `exploring` won't end the
    // operation prematurely if they are both empty while paths are dequeued
    this.writeLock.acquire();
    const paths = this.exploreQueue.dequeue(exploreChunkSize);
    this.exploring.increment(paths.length);
    this.writeLock.release();

    if (paths.length === 0) return;

    const [docPaths, colPaths] = split(paths, isDocumentPath);
    const docPathsFiltered = docPaths.filter((path) =>
      typeof depth === "number" ? documentPathDepth(path) < depth : true
    );
    this.exploring.decrement(docPaths.length - docPathsFiltered.length);

    await Promise.all([
      this.exploreForDocuments(colPaths, limit),
      this.exploreForSubcollections(docPathsFiltered),
    ]);
  }

  private async exploreForDocuments(
    paths: string[],
    limit?: number | undefined
  ) {
    if (paths.length > 0)
      this.logger.debug(
        `Exploring for documents in ${plural(paths, "collection")}`
      );

    for (const path of paths) {
      if (this.limitReached) {
        this.exploring.decrement(1);
        continue;
      }

      // Stream the document data instead of using `listDocuments`
      // `listDocuments` incurs a cost per document listed so we might as read the data
      let count = 0;
      await new Promise<void>((resolve, reject) => {
        let query: Query = this.firestore.collection(path);
        if (typeof limit === "number")
          query = query.limit(this.getRemaining(limit));
        const stream = query.stream();
        stream
          .on("data", (snapshot: QueryDocumentSnapshot) => {
            this.exploreQueue.push(snapshot.ref.path);
            this.exports.push(snapshot);
            this.reads++;
            if (this.limitReached) stream.pause();
          })
          .on("error", (error) => reject(error))
          .on("pause", () => {
            this.exploring.decrement(1);
            resolve();
          })
          .on("end", () => {
            this.exploring.decrement(1);
            resolve();
          });
      });

      if (count > 0)
        this.logger.verbose(`Found ${plural(count, "document")} in ${r(path)}`);
    }
  }

  private async exploreForSubcollections(paths: string[]) {
    if (paths.length > 0)
      this.logger.debug(
        `Exploring for subcollections in ${plural(paths, "document")}`
      );

    if (this.limitReached) {
      this.exploring.decrement(paths.length);
      return;
    }

    // ASSUMPTION: documents generally won't have too many subcollections
    // So it should be more performant to perform these calls in parallel
    // The number of paths shouldn't exceed `exploreChunkSize` anyway
    const subcollectionsList = await Promise.all(
      paths.map((path) =>
        (path ? this.firestore.doc(path) : this.firestore).listCollections()
      )
    );

    const subcollections = subcollectionsList.flat();

    if (subcollections.length > 0) {
      subcollections.forEach((col) => this.exploreQueue.push(col.path));
      this.logger.verbose(`Found ${plural(subcollections, "subcollection")}`);
    }

    this.exploring.decrement(paths.length);
  }

  /**
   * Download a chunk of documents from the {@link exports} queue
   * from Firestore, then write them to the data source.
   */
  private async downloadAction(options: ExportOptions) {
    const { match, ignore, limit, downloadChunkSize = limit } = options;

    // Use a lock here so that `exportPaths` and `exporting` won't end the
    // operation prematurely if they are both empty while paths are dequeued
    this.writeLock.acquire();
    let readyToExport = this.exports
      .dequeue(downloadChunkSize)
      // Filter out any collection paths
      .filter((path) => typeof path !== "string" || isDocumentPath(path))
      // Filter out any paths that don't match
      .filter((item) => {
        if (!match || match.length === 0) return true;
        const path = typeof item === "string" ? item : item.ref.path;
        const matched = match.some((pattern) => path.match(pattern));
        this.logger.verbose(`Path matched ${matched ? y : n} ${r(path)}`);
        return matched;
      })
      // Filter out any paths that should be ignored
      .filter((item) => {
        if (!ignore || ignore.length === 0) return true;
        const path = typeof item === "string" ? item : item.ref.path;
        const ignored = ignore.some((pattern) => path.match(pattern));
        if (ignored) this.logger.verbose(`Path ignored ${n} ${r(path)}`);
        return !ignored;
      });

    if (typeof limit === "number") {
      // Make sure we don't export over the limit
      const remaining = this.getRemaining(limit);
      if (readyToExport.length >= remaining) this.limitReached = true;
      readyToExport = readyToExport.splice(0, remaining);
      this.logger.verbose(
        `Exports remaining: ${count(remaining)} / ${count(limit)}`
      );
    }

    this.exporting.increment(readyToExport.length);
    this.writeLock.release();

    if (readyToExport.length === 0) return;

    this.logger.verbose(`Exporting ${plural(readyToExport, "document")}...`);

    const [paths, snapshots] = splitStrict(
      readyToExport,
      (ex): ex is string => typeof ex === "string"
    );

    const refs = paths.map((path) => this.firestore.doc(path));
    type Snapshot = QueryDocumentSnapshot | DocumentSnapshot;
    const allSnapshots: Snapshot[] = snapshots;

    const serializedDocuments = allSnapshots
      .concat(refs.length > 0 ? await this.firestore.getAll(...refs) : [])
      .map((snapshot) =>
        FirestoreDocument.serialize(snapshot.ref.path, snapshot.data())
      )
      .filter((val): val is string => typeof val === "string");

    await this.writer.write(serializedDocuments);
    this.exported.increment(serializedDocuments.length);
    this.exporting.decrement(readyToExport.length);

    this.logger.debug(
      `Successfully exported ${plural(serializedDocuments, "document")}`
    );
  }
}

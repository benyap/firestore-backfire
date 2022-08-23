import { Firestore } from "@google-cloud/firestore";
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
} from "~/utils";
import { IDataSourceWriter } from "~/data-source/interface";

import { ExportFirestoreDataOptions as ExportOptions } from "./types";

export class Exporter {
  private firestore = FirestoreFactory.create(this.connection);

  private writeLock = new Lock();
  private tracker = new Tracker();
  private exploreQueue = new TrackableList<string>(this.tracker);
  private exploring = new TrackableNumber(this.tracker);
  private exportPaths = new TrackableList<string>(this.tracker);
  private exporting = new TrackableNumber(this.tracker);
  private exported = new TrackableNumber(this.tracker);
  private limitReached = false;

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
      this.exportPaths.set(paths);
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
      when: () => this.exportPaths.length > 0,
      until: () =>
        ((this.exploreQueue.length === 0 && this.exploring.val === 0) ||
          this.limitReached) &&
        this.exportPaths.length === 0 &&
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
      action: () => {
        this.logger.debug(
          [
            `Progress: ${count(this.exported)} exported`,
            `${count(this.exploring)} exploring`,
            `${count(this.exploreQueue)} to explore`,
          ].join(", ")
        );
      },
    });

    log.start();
    await Promise.all([explore.start(), download.start()]);
    await this.writer.close();
    log.abort();

    return { exported: this.exported.val };
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
    const { depth, exploreChunkSize = 1000 } = options;

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

    if (docPathsFiltered.length > 0 && colPaths.length > 0)
      this.logger.verbose(
        `Exploring ${[
          plural(colPaths, "collection"),
          plural(docPathsFiltered, "document"),
        ].join(", ")}`
      );
    else if (docPathsFiltered.length > 0)
      this.logger.verbose(
        `Exploring for subcollections in ${plural(docPaths, "document")}`
      );
    else if (colPaths.length > 0)
      this.logger.verbose(
        `Exploring for documents in ${plural(colPaths, "collection")}`
      );

    for (const path of colPaths) {
      if (this.limitReached) {
        this.exploring.decrement(1);
        continue;
      }

      const ref = this.firestore.collection(path);
      let documents = await ref.listDocuments();
      this.exploring.decrement(1);

      if (documents.length === 0) continue;

      documents.forEach((doc) => {
        this.exploreQueue.push(doc.path);
        this.exportPaths.push(doc.path);
      });

      this.logger.verbose(
        `Found ${plural(documents, "document")} in ${r(path)}`
      );
    }

    for (const path of docPathsFiltered) {
      if (this.limitReached) {
        this.exploring.decrement(1);
        continue;
      }

      const ref = path ? this.firestore.doc(path) : this.firestore;
      const collections = await ref.listCollections();
      if (collections.length > 0) {
        collections.forEach((col) => this.exploreQueue.push(col.path));
        this.logger.verbose(
          `Found ${plural(collections, "subcollection")} in ${r(path)}`
        );
      }
      this.exploring.decrement(1);
    }
  }

  /**
   * Download a chunk of documents from the {@link exportPaths} queue
   * from Firestore, then write them to the data source.
   */
  private async downloadAction(options: ExportOptions) {
    const { match, ignore, limit, downloadChunkSize = 1000 } = options;

    // Use a lock here so that `exportPaths` and `exporting` won't end the
    // operation prematurely if they are both empty while paths are dequeued
    this.writeLock.acquire();
    let paths = this.exportPaths
      .dequeue(downloadChunkSize)
      // Filter out any collection paths
      .filter((path) => isDocumentPath(path))
      // Filter out any paths that don't match
      .filter((path) => {
        if (!match || match.length === 0) return true;
        const matched = match.some((pattern) => path.match(pattern));
        this.logger.verbose(`Path match   ${matched ? y : n} ${r(path)}`);
        return matched;
      })
      // Filter out any paths that should be ignored
      .filter((path) => {
        if (!ignore || ignore.length === 0) return true;
        const ignored = ignore.some((pattern) => path.match(pattern));
        if (ignored) this.logger.verbose(`Path ignored ${n} ${r(path)}`);
        return !ignored;
      });

    if (typeof limit === "number") {
      // Make sure we don't export over the limit
      const done =
        this.exported.val + this.exporting.val + this.exportPaths.length;
      const remaining = limit - done;
      if (paths.length >= remaining) this.limitReached = true;
      paths = paths.splice(0, remaining);
    }

    this.exporting.increment(paths.length);
    this.writeLock.release();

    if (paths.length === 0) return;

    this.logger.verbose(`Exporting ${plural(paths, "document")}`);

    const refs = paths.map((path) => this.firestore.doc(path));
    const snapshots = await this.firestore.getAll(...refs);
    const serializedDocuments = snapshots
      .map((snapshot) =>
        FirestoreDocument.serialize(snapshot.ref.path, snapshot.data())
      )
      .filter((val): val is string => typeof val === "string");

    await this.writer.write(serializedDocuments);
    this.exported.increment(serializedDocuments.length);
    this.exporting.decrement(paths.length);
  }
}

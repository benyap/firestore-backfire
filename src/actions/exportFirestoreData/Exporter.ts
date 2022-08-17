import {
  FirestoreConnectionOptions,
  FirestoreDocument,
  FirestoreFactory,
} from "~/services";
import {
  collectionPathDepth,
  count,
  dir,
  documentPathDepth,
  isDocumentPath,
  Logger,
  plural,
  RepeatedOperation,
  TrackableList,
  TrackableNumber,
  Tracker,
} from "~/utils";
import { IDataOutput } from "~/data-source/interface";

export interface ExporterOptions {}

export class Exporter {
  private firestore = FirestoreFactory.create(this.connection);

  private exportPaths: string[] = [];

  private tracker = new Tracker();
  private exploreQueue = new TrackableList<string>(this.tracker);
  private exploring = new TrackableNumber(this.tracker);
  private exporting = new TrackableNumber(this.tracker);
  private exported = new TrackableNumber(this.tracker);

  constructor(
    private connection: FirestoreConnectionOptions,
    private output: IDataOutput,
    private logger: Logger
  ) {}

  async run(options: {
    paths?: string[];
    match?: RegExp[];
    ignore?: RegExp[];
    depth?: number;
  }) {
    const { paths, match, ignore, depth } = options;

    // Get starting paths to explore
    if (paths) this.exploreQueue.set(paths);
    else {
      const collections = await this.firestore.listCollections();
      this.exploreQueue.set(collections.map((col) => col.path));
    }

    // List data paths from Firestore
    const list = new RepeatedOperation({
      interval: 1_000,
      when: () => this.exploreQueue.length > 0 && this.exploring.val < 5_000,
      until: () => this.exploreQueue.length === 0 && this.exploring.val === 0,
      action: async () => {
        const paths = this.exploreQueue
          .update((l) => l.splice(0, 5_000))
          // Filter out any paths that are deeper than the depth limit
          .filter((path) => {
            if (typeof depth !== "number") return true;
            if (isDocumentPath(path)) return documentPathDepth(path) <= depth;
            return collectionPathDepth(path) <= depth;
          });

        if (paths.length === 0) return;

        this.exploring.add(paths.length);
        this.logger.verbose(`Exploring ${plural(paths, "path")}`);

        for (const path of paths) {
          let foundPaths: string[] = [];

          if (isDocumentPath(path)) {
            this.exportPaths.push(path);
            const ref = path ? this.firestore.doc(path) : this.firestore;
            const collections = await ref.listCollections();
            foundPaths = collections.map((collection) => collection.path);
          } else {
            const ref = this.firestore.collection(path);
            const documents = await ref.listDocuments();
            foundPaths = documents.map((doc) => doc.path);
          }

          foundPaths.forEach((path) => this.exploreQueue.push(path));
          this.exploring.subtract(1);

          if (foundPaths.length > 0)
            this.logger.verbose(
              `Found ${plural(paths, "path")} in ${dir(path)}`
            );
        }
      },
    });

    // Download data from Firestore and export it
    const download = new RepeatedOperation({
      interval: 2_000,
      when: () => this.exportPaths.length > 0 && this.exporting.val < 5_000,
      until: () => this.exploreQueue.length === 0 && this.exploring.val === 0,
      action: async () => {
        const paths = this.exportPaths
          .splice(0, 1000)
          // Filter out any paths that don't match patterns
          .filter((path) => {
            if (!Array.isArray(match) || match.length === 0) return true;
            return match.some((pattern) => path.match(pattern));
          })
          // Filter out any paths that match ignorePatterns
          .filter((path) => {
            if (!Array.isArray(ignore) || ignore.length === 0) return true;
            return !ignore.some((pattern) => path.match(pattern));
          });

        if (paths.length === 0) return;

        this.exporting.add(paths.length);
        this.logger.verbose(`Exporting ${plural(paths, "document")}`);

        const refs = paths.map((path) => this.firestore.doc(path));
        const snapshots = await this.firestore.getAll(...refs);
        const serializedDocuments = snapshots.map((snapshot) =>
          FirestoreDocument.serialize(snapshot.ref.path, snapshot.data())
        );

        this.exporting.subtract(serializedDocuments.length);
        await this.output.write(serializedDocuments);
        this.exported.add(serializedDocuments.length);
      },
    });

    // Log status every few seconds
    const log = new RepeatedOperation({
      when: () => this.tracker.touched(),
      until: () => this.exploreQueue.length === 0 && this.exploring.val === 0,
      interval: 5_000,
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
    await Promise.all([list.start(), download.start()]);
    log.abort();

    return this.exported;
  }
}

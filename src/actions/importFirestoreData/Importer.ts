import {
  FirestoreConnectionOptions,
  FirestoreDocument,
  FirestoreFactory,
  documentPathDepth,
} from "~/firestore";
import {
  count,
  Lock,
  Logger,
  NDJSON,
  ref,
  RepeatedOperation,
  TrackableList,
  TrackableNumber,
  Tracker,
} from "~/utils";
import { IDataReader } from "~/data-source/interface";
import { DeserializedFirestoreDocument } from "~/firestore/FirestoreDocument/types";

import { ImportFirestoreDataOptions as ImportOptions } from "./types";

const DELIMETER = "\n";

export class Importer {
  private firestore = FirestoreFactory.create(this.connection);

  private readLock = new Lock();
  private tracker = new Tracker();
  private pending = new TrackableList(this.tracker);
  private processing = new TrackableNumber(this.tracker);
  private imported = new TrackableNumber(this.tracker);
  private skipped = new TrackableNumber(this.tracker);
  private failed = new TrackableNumber(this.tracker);
  private limitReached = false;

  constructor(
    private connection: FirestoreConnectionOptions,
    private reader: IDataReader,
    private logger: Logger
  ) {}

  async run(options: ImportOptions) {
    const {
      limit,
      update: updateInterval = 5,
      flush: flushInterval = 1,
      processInterval = 10,
    } = options;

    await this.reader.open();

    const errors: FirebaseFirestore.BulkWriterError[] = [];
    const writer = this.firestore.bulkWriter();

    // Read NDJSON data from the data source
    let buffer = "";
    this.readLock.acquire();
    this.reader
      .read((data) => {
        buffer += data;
        const linebreak = buffer.lastIndexOf(DELIMETER);
        if (linebreak < 0) return;
        const parsable = buffer.slice(0, linebreak);
        buffer = buffer.slice(linebreak);
        const documents = NDJSON.parse(parsable);
        documents.forEach((doc) => this.pending.push(doc));
      })
      .then(() => this.readLock.release());

    // Process documents that were parsed
    const processor = new RepeatedOperation({
      interval: processInterval,
      when: () => this.pending.length > 0 && !this.limitReached,
      until: () =>
        !this.readLock.locked &&
        this.processing.val === 0 &&
        (this.pending.length === 0 || this.limitReached),
      action: async () => {
        if (typeof limit === "number") {
          const done =
            this.processing.val +
            this.imported.val +
            this.skipped.val +
            this.failed.val;
          const remaining = limit - done;
          if (remaining <= 0) {
            this.limitReached = true;
            return;
          }
        }
        this.processing.increment(1);
        const document = this.pending.pop();
        this.processDocument(document, writer, errors, options);
      },
    });

    // Flush data to Firestore
    const flush = new RepeatedOperation({
      interval: flushInterval * 1000,
      until: () =>
        !this.readLock.locked &&
        this.processing.val === 0 &&
        (this.pending.length === 0 || this.limitReached),
      action: () => writer.flush(),
    });

    // Log status every few seconds
    const log = new RepeatedOperation({
      interval: updateInterval * 1000,
      when: () =>
        this.tracker.touched() &&
        (this.imported.val > 0 ||
          this.pending.length > 0 ||
          this.skipped.val > 0 ||
          this.failed.val > 0),
      action: () => {
        this.logger.debug(
          [
            `Progress: ${count(this.imported)} imported`,
            `${count(this.pending)} pending`,
            `${count(this.skipped)} skipped`,
            `${count(this.failed)} failed to import`,
          ].join(", ")
        );
      },
    });

    log.start();
    await Promise.all([processor.start(), flush.start()]);
    await writer.flush();
    await writer.close();
    log.abort();

    return { imported: this.imported.val, errors };
  }

  private async processDocument(
    object: unknown,
    writer: FirebaseFirestore.BulkWriter,
    errors: FirebaseFirestore.BulkWriterError[],
    options: ImportOptions
  ) {
    if (object === null || typeof object !== "object") {
      this.processing.decrement(1);
      this.failed.increment(1);
      this.logger.verbose(`Failed to process document (not an object)`);
      return;
    }

    let document: DeserializedFirestoreDocument;
    try {
      document = FirestoreDocument.deserialize(object, this.firestore);
    } catch (error) {
      this.processing.decrement(1);
      this.failed.increment(1);
      this.logger.warn(error);
      return;
    }

    const { path, data } = document;
    const { paths, match, ignore, depth, mode = "create" } = options;

    if (paths && paths.length > 0 && !paths.some((p) => path.startsWith(p))) {
      this.processing.decrement(1);
      this.skipped.increment(1);
      this.logger.verbose(`Not importing path ${ref(path)}`);
      return;
    }

    if (typeof depth === "number" && documentPathDepth(path) > depth) {
      this.processing.decrement(1);
      this.skipped.increment(1);
      this.logger.verbose(`Depth of ${depth} exceeded, skipping ${ref(path)}`);
      return;
    }

    if (match && match.length > 0 && !match.some((p) => p.test(path))) {
      this.processing.decrement(1);
      this.skipped.increment(1);
      this.logger.verbose(`No match for path, skipping ${ref(path)}`);
      return;
    }

    if (ignore && ignore.length > 0 && ignore.some((p) => p.test(path))) {
      this.processing.decrement(1);
      this.skipped.increment(1);
      this.logger.verbose(`Path ignored, skipping ${ref(path)}`);
      return;
    }

    try {
      switch (mode) {
        case "create":
        case "insert":
          await writer.create(this.firestore.doc(path), data);
          break;
        case "overwrite":
          await writer.set(this.firestore.doc(path), data);
          break;
        case "merge":
          await writer.set(this.firestore.doc(path), data, { merge: true });
          break;
      }
      this.logger.verbose(`Imported ${ref(path)}`);
      this.imported.increment(1);
    } catch (e) {
      const error = e as FirebaseFirestore.BulkWriterError;
      const { documentRef, code, message } = error;
      const path = ref(documentRef.path);
      switch (code) {
        case 6:
          if (mode === "insert") {
            this.logger.verbose(`Skipped existing document: ${path}`);
            this.skipped.increment(1);
          } else {
            this.logger.error(`Cannot overwrite existing document: ${path}`);
            this.failed.increment(1);
          }
          break;
        default:
          this.logger.error(`Error code ${code}: ${message}`);
          break;
      }
      errors.push(error);
    } finally {
      this.processing.decrement(1);
    }
  }
}

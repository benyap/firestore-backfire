import { Firestore } from "@google-cloud/firestore";

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
  n,
  NDJSON,
  ref,
  RepeatedOperation,
  TrackableList,
  TrackableNumber,
  Tracker,
  y,
} from "~/utils";
import { IDataSourceReader } from "~/data-source/interface";
import {
  DeserializedFirestoreDocument,
  SerializedFirestoreDocument,
} from "~/firestore/FirestoreDocument/types";

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
    private connection: FirestoreConnectionOptions | Firestore,
    private reader: IDataSourceReader,
    private logger: Logger,
  ) {}

  async run(options: ImportOptions) {
    const {
      update: updateInterval = 5,
      flush: flushInterval = 1,
      processInterval = 10,
      processLimit = 200,
    } = options;

    await this.reader.open?.();

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
      .then(() => {
        // Parse any remaining data in buffer
        if (buffer) {
          const documents = NDJSON.parse(buffer);
          documents.forEach((doc) => this.pending.push(doc));
        }
        // Release lock
        this.readLock.release();
      });

    // Process documents that were parsed
    const processor = new RepeatedOperation({
      interval: processInterval,
      when: () =>
        this.pending.length > 0 &&
        !this.limitReached &&
        this.processing.val <= processLimit,
      until: () =>
        !this.readLock.locked &&
        this.processing.val === 0 &&
        (this.pending.length === 0 || this.limitReached),
      action: async () => {
        if (this.limitReached) return;
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
      action: () =>
        writer.flush().then(() => this.logger.verbose(`Flushed writes`)),
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
            // `${count(this.processing)} processing`,
            `${count(this.skipped)} skipped`,
            `${count(this.failed)} failed to import`,
          ].join(", "),
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
    options: ImportOptions,
  ) {
    if (object === null || typeof object !== "object") {
      this.processing.decrement(1);
      this.failed.increment(1);
      this.logger.verbose(`Failed to process document (not an object)`);
      return;
    }

    let document: DeserializedFirestoreDocument;
    try {
      document = FirestoreDocument.deserialize(
        object as Partial<SerializedFirestoreDocument>,
        this.firestore,
      );
    } catch (error) {
      this.processing.decrement(1);
      this.failed.increment(1);
      this.logger.warn(error);
      return;
    }

    const { path, data } = document;
    const { paths, match, ignore, depth, limit, mode = "create" } = options;

    if (paths && paths.length > 0 && !paths.some((p) => path.startsWith(p))) {
      this.processing.decrement(1);
      this.skipped.increment(1);
      this.logger.verbose(`Not importing path ${ref(path)}`);
      return;
    }

    if (typeof depth === "number" && documentPathDepth(path) > depth) {
      this.processing.decrement(1);
      this.skipped.increment(1);
      this.logger.verbose(`Depth ${count(depth)} exceeded ${n} ${ref(path)}`);
      return;
    }

    if (match && match.length > 0) {
      const matched = match.some((p) => p.test(path));
      this.logger.verbose(`Path match   ${matched ? y : n} ${ref(path)}`);
      if (!matched) {
        this.processing.decrement(1);
        this.skipped.increment(1);
        return;
      }
    }

    if (ignore && ignore.length > 0) {
      const ignored = ignore.some((p) => p.test(path));
      if (ignored) {
        this.logger.verbose(`Path ignored ${n} ${ref(path)}`);
        this.processing.decrement(1);
        this.skipped.increment(1);
        return;
      }
    }

    if (typeof limit === "number") {
      const remaining = limit - this.imported.val;
      if (remaining <= 0) {
        this.processing.decrement(1);
        this.limitReached = true;
        return;
      }
    }

    this.imported.increment(1);

    try {
      switch (mode) {
        case "create":
        case "insert":
          await writer.create(this.firestore.doc(path), data).catch((error) => {
            this.imported.decrement(1);
            throw error;
          });
          break;
        case "overwrite":
          await writer.set(this.firestore.doc(path), data).catch((error) => {
            this.imported.decrement(1);
            throw error;
          });
          break;
        case "merge":
          await writer
            .set(this.firestore.doc(path), data, { merge: true })
            .catch((error) => {
              this.imported.decrement(1);
              throw error;
            });
          break;
      }

      this.logger.verbose(`Written to ${ref(path)}`);
    } catch (e) {
      const error = e as FirebaseFirestore.BulkWriterError;
      const { documentRef, code, message } = error;
      const path = ref(documentRef?.path ?? "<undefined>");
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
          if (typeof code === "number")
            this.logger.error(`Error: ${message} (${path})`);
          else this.logger.error(error);
          this.failed.increment(1);
          break;
      }
      errors.push(error);
    } finally {
      this.processing.decrement(1);
    }
  }
}

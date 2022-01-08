import { FirestoreConnectionOptions, FirestoreDataOptions } from "~/types";
import { StorageSourceOptions } from "~/services/StorageSourceService";

export type ExportFirestoreDataOptions = FirestoreConnectionOptions &
  FirestoreDataOptions &
  StorageSourceOptions & {
    /**
     * If `true`, any existing data in the export location will
     * be overwritten.
     */
    force?: boolean;

    /**
     * If `true`, the exported JSON will be prettified.
     */
    prettify?: boolean;
  };

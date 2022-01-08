import { FirestoreConnectionOptions, FirestoreDataOptions } from "~/types";
import { StorageSourceOptions } from "~/services/StorageSourceService";

export type ImportFirestoreDataOptions = FirestoreConnectionOptions &
  FirestoreDataOptions &
  StorageSourceOptions & {
    /**
     * Specify whether to create, merge or overwrite documents when
     * importing. When using "create" mode, attempting to import
     * documents to paths with existing data will fail. When using
     * the "create-and-skip-existing" mode, only documents that do
     * not exist will be created, and documents that exist will be
     * skipped without failing.
     *
     * @default "create"
     */
    mode?: "create" | "create-and-skip-existing" | "merge" | "overwrite";
  };

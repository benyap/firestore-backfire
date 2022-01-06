import { FirestoreConnectionOptions, FirestoreDataOptions } from "~/types";
import { StorageSourceOptions } from "~/services/StorageSourceService";

export type ImportFirestoreDataOptions = FirestoreConnectionOptions &
  FirestoreDataOptions &
  StorageSourceOptions & {
    /**
     * Merge data into existing documents if they already exist when
     * importing. Cannot be used when `overwrite` is true.
     */
    merge?: boolean;

    /**
     * Overwrite data for any existing documents when importing.
     * Cannot be used when `merge` is true.
     */
    overwrite?: boolean;
  };

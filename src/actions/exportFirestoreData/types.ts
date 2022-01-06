import { FirestoreConnectionOptions, FirestoreDataOptions } from "~/types";
import { StorageSourceOptions } from "~/services/StorageSourceService";

export type ExportFirestoreDataOptions = FirestoreConnectionOptions &
  FirestoreDataOptions &
  StorageSourceOptions;

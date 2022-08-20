import { LoggingOptions } from "./logging";
import { ExportFirestoreDataOptions } from "./exportFirestoreData";
import { GetFirestoreDataOptions } from "./getFirestoreData";
import { ImportFirestoreDataOptions } from "./importFirestoreData";
import { ListFirestoreDataOptions } from "./listFirestoreData";

export type ActionOptions = LoggingOptions &
  GetFirestoreDataOptions &
  ListFirestoreDataOptions &
  ExportFirestoreDataOptions &
  ImportFirestoreDataOptions;

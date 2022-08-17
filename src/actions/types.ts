import { ExportFirestoreDataOptions } from "./exportFirestoreData";
import { GetFirestoreDataOptions } from "./getFirestoreData";
import { ListFirestoreDataOptions } from "./listFirestoreData";

export type ActionOptions = GetFirestoreDataOptions &
  ListFirestoreDataOptions &
  ExportFirestoreDataOptions;

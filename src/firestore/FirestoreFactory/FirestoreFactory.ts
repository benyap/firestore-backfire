import { Firestore, Settings } from "@google-cloud/firestore";
import { EError } from "exceptional-errors";

import { FirestoreConnectionOptions } from "./types";

class FirestoreFactoryError extends EError {}

export class FirestoreFactory {
  static create({
    project,
    emulator,
    credentials,
    keyFile,
  }: FirestoreConnectionOptions): Firestore {
    if (!project) throw new FirestoreFactoryError("project is required");
    if (emulator) return this.createWithEmulator(project, emulator);
    if (credentials) return this.createWithCredentials(project, credentials);
    if (keyFile) return this.createWithKeyFile(project, keyFile);
    throw new FirestoreFactoryError("no connection options provided");
  }

  static createWithKeyFile(projectId: string, keyFilename: string) {
    return new Firestore({ projectId, keyFilename });
  }

  static createWithCredentials(
    projectId: string,
    credentials: Required<NonNullable<Settings["credentials"]>>
  ) {
    return new Firestore({ projectId, credentials });
  }

  static createWithEmulator(projectId: string, host: string | true) {
    if (host === true)
      process.env["FIRESTORE_EMULATOR_HOST"] = "localhost:8080";
    else process.env["FIRESTORE_EMULATOR_HOST"] = host;
    return new Firestore({ projectId });
  }
}

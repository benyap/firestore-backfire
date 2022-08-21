import { Firestore, Settings } from "@google-cloud/firestore";
import { EError } from "exceptional-errors";

import { FirestoreConnectionOptions } from "./types";

class FirestoreFactoryError extends EError {}

export class FirestoreFactory {
  static create(options: FirestoreConnectionOptions | Firestore): Firestore {
    if (options instanceof Firestore) return options;
    const {
      project,
      credentials,
      emulator = process.env["FIRESTORE_EMULATOR_HOST"],
      keyFile = process.env["GOOGLE_APPLICATION_CREDENTIALS"],
    } = options;
    if (!project) throw new FirestoreFactoryError("project is required");
    if (credentials) return this.createWithCredentials(project, credentials);
    if (emulator) return this.createWithEmulator(project, emulator);
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
    if (host)
      process.env["FIRESTORE_EMULATOR_HOST"] =
        typeof host === "string" ? host : "localhost:8080";
    return new Firestore({ projectId });
  }
}

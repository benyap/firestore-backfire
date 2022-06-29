import { Firestore, Settings } from "@google-cloud/firestore";
import { EError } from "exceptional-errors";

class FirestoreFactoryError extends EError {}

export type FirestoreConnectionOptions = {
  /**
   * The Firestore project to connect to.
   */
  project?: string;

  /**
   * The path to the service account private key to use to connect to Firestore.
   */
  keyfile?: string;

  /**
   * The service account credentials to use to connect to Firestore.
   *
   * Takes precedence over `keyfile`.
   */
  credentials?: Required<Settings["credentials"]>;

  /**
   * The host and port of the local Firestore emulator to connect to.
   *
   * Takes precedence over `keyfile` and `credentials`.
   */
  emulator?: string;
};

export class FirestoreFactory {
  static create({
    project,
    emulator,
    credentials,
    keyfile,
  }: FirestoreConnectionOptions): Firestore {
    if (!project) throw new FirestoreFactoryError("project is required");
    if (emulator) return this.createWithEmulator(project, emulator);
    if (credentials) return this.createWithCredentials(project, credentials);
    if (keyfile) return this.createWithKeyfile(project, keyfile);
    throw new FirestoreFactoryError("no connection options provided");
  }

  static createWithKeyfile(projectId: string, keyFilename: string) {
    return new Firestore({ projectId, keyFilename });
  }

  static createWithCredentials(
    projectId: string,
    credentials: NonNullable<Required<Settings["credentials"]>>
  ) {
    return new Firestore({ projectId, credentials });
  }

  static createWithEmulator(projectId: string, host: string) {
    process.env["FIRESTORE_EMULATOR_HOST"] = host;
    return new Firestore({ projectId });
  }
}

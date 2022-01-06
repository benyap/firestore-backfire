import { Firestore } from "@google-cloud/firestore";

import { FirestoreConnectionOptions } from "~/types";
import { ConfigurationError, ConnectionError } from "~/errors";
import { delay } from "~/utils";

function createFirestore(
  projectId: string,
  options: FirestoreConnectionOptions
): Firestore {
  const { emulator, credentials, keyfile } = options;

  if (emulator) {
    process.env.FIRESTORE_EMULATOR_HOST = emulator;
    return new Firestore({ projectId });
  }
  if (credentials) return new Firestore({ projectId, credentials });
  if (keyfile) return new Firestore({ projectId, keyFilename: keyfile });

  throw new ConfigurationError("no Firestore credentials provided");
}

export class FirestoreService {
  /**
   * Create a new `FirestoreService` instance and tests the connection.
   * May throw a `ConnectionError` if unable to connect to Firestore.
   */
  static async create(options: FirestoreConnectionOptions) {
    const { project, emulator, credentials, keyfile } = options;

    if (!project)
      throw new ConfigurationError(
        `missing project id`,
        `Please specify a Firebase project id`
      );

    if (!emulator && !credentials && !keyfile)
      throw new ConfigurationError(
        `missing connection options`,
        `Please specify credentials for connecting to Firestore`
      );

    const firestore = createFirestore(project, options);
    const service = new FirestoreService(firestore);

    const connected = await service.testConnection();
    if (!connected)
      throw new ConnectionError(
        `connection to Firestore timed out`,
        `Verify that the Firestore connection details are correct and that your network connection is available.`
      );

    return service;
  }

  private constructor(public readonly firestore: Firestore) {}

  /**
   * Returns `true` if the service is able to read from Firestore.
   *
   * @param timeout The time to wait before returning `false`.
   */
  async testConnection(timeout: number = 9_000): Promise<boolean> {
    const result = await Promise.race([
      this.firestore.doc("test/document").get(),
      delay(timeout),
    ]);
    return Boolean(result);
  }
}

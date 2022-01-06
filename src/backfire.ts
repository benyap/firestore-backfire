import { exportFirestoreData, importFirestoreData } from "~/actions";

async function main() {
  try {
    await exportFirestoreData({
      path: ".export/test",
      project: "monash-bulk-messaging-dev",
      keyfile: ".keyfiles/msend-dev.json",
      type: "local",
      collections: ["emails"],
      logLevel: "verbose",
      patterns: [/C61s0P9Cd0eEF0usZrGM/],
      concurrency: 3,
    });

    await importFirestoreData({
      path: ".export/test",
      project: "demo",
      emulator: "localhost:8080",
      logLevel: "verbose",
      type: "local",
      concurrency: 1,
      patterns: [/^emails/],
      depth: 1,
      merge: true,
    });
  } catch (error: any) {
    console.log(error);
  }
}

main();

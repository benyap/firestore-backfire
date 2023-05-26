import { faker } from "@faker-js/faker/locale/en_AU";
import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";

faker.seed(0);

//
// Generate test data to upload to Firesore.
//

const documents = Array.from({
  length: faker.number.int({ min: 15_000, max: 25_000 }),
}).map(() => generateDocument());

const nestedDocuments = documents.map((document) =>
  Array.from({ length: faker.number.int({ min: 10, max: 30 }) }).map(() =>
    generateSubDocument(document)
  )
);

console.log("Generated", documents.length, "documents");
console.log("Generated", nestedDocuments.flat().length, "nested documents");

const lines = documents
  .concat(nestedDocuments)
  .flat()
  .map((doc) => JSON.stringify(doc));

await mkdir(".export", { recursive: true });
const filename = ".export/seed.ndjson";

const stream = createWriteStream(filename);

for (const line of lines) {
  await new Promise((resolve) => stream.write(line + "\n", resolve));
}

stream.end();
console.log("Wrote", lines.length, "lines to", filename);

// --- helper functions ---

/**
 * Generate a document that can be imported into Firestore.
 *
 * @type {() => import("../src/firestore/FirestoreDocument").SerializedFirestoreDocument}
 */
function generateDocument() {
  return {
    path: `events/${faker.string.nanoid(20)}`,
    data: {
      created: {
        _seconds: Math.floor(new Date().getTime() / 1000),
        _nanoseconds: 0,
      },
      expiry: {
        _seconds: Math.floor(faker.date.future({ years: 1 }).getTime() / 1000),
        _nanoseconds: 0,
      },
      location: {
        _latitude: faker.location.latitude(),
        _longitude: faker.location.longitude(),
      },
      profile: {
        title: faker.person.prefix(),
        name: faker.person.fullName(),
        sex: faker.person.sex(),
        job: faker.person.jobTitle(),
        bio: faker.person.bio(),
        dateOfBirth: {
          _seconds: Math.floor(faker.date.past().getTime() / 1000),
          _nanoseconds: 0,
        },
      },
      online: {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        image: faker.internet.avatar(),
        website: faker.internet.url(),
        ip: faker.internet.ip(),
      },
      cars: Array.from({ length: faker.number.int({ min: 5, max: 20 }) }).map(
        () => ({
          make: faker.vehicle.manufacturer(),
          model: faker.vehicle.model(),
          registration: faker.vehicle.vrm(),
        })
      ),
      tags: Array.from({ length: faker.number.int({ min: 20, max: 50 }) }).map(
        () => faker.company.buzzNoun()
      ),
      description: faker.lorem.lines(),
      books: Array.from({ length: faker.number.int({ min: 5, max: 10 }) }).map(
        () => ({
          image: faker.internet.url(),
          link: faker.internet.url(),
          title: faker.finance.accountName(),
        })
      ),
      appendices: Array.from({
        length: faker.number.int({ min: 5, max: 15 }),
      }).map(() => ({
        mediaAuthor: faker.company.name(),
        image: faker.internet.url(),
        orderNum: faker.string.numeric(),
        title: faker.vehicle.manufacturer(),
      })),
    },
    geopoints: ["location"],
    timestamps: ["created", "expiry", "profile.dateOfBirth"],
  };
}

/**
 * Generate a document that lives under a subcollection of the given document.
 *
 * @type {(document: import("../src/firestore/FirestoreDocument").SerializedFirestoreDocument) => import("../src/firestore/FirestoreDocument").SerializedFirestoreDocument}
 */
function generateSubDocument(document) {
  return {
    path: `${document.path}/messages/${faker.string.nanoid()}`,
    data: {
      created: {
        _seconds: Math.floor(new Date().getTime() / 1000),
        _nanoseconds: 0,
      },
      expiry: {
        _seconds: Math.floor(faker.date.future({ years: 1 }).getTime() / 1000),
        _nanoseconds: 0,
      },
      message: faker.lorem.paragraphs({ min: 5, max: 10 }),
      ip: faker.internet.ip(),
      tags: Array.from({ length: faker.number.int({ min: 20, max: 50 }) }).map(
        () => faker.company.buzzNoun()
      ),
    },
    timestamps: ["created", "expiry"],
  };
}

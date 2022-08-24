# 🔥 Firestore Backfire <!-- omit in toc -->

[![npm version](https://img.shields.io/npm/v/firestore-backfire)](https://npmjs.com/package/firestore-backfire)
[![License](https://img.shields.io/github/license/benyap/firestore-backfire)](LICENSE)

Ultimate control over importing and exporting data from Firestore and the
Firestore Emulator, on your CLI and in your code.

This documentation is for 2.x. Find documentation for 1.x
[here](https://github.com/benyap/firestore-backfire/blob/cc4e4e7a93a7b2e207db1566723beb8228030fe0/README.md).

### ✨ Features ✨ <!-- omit in toc -->

- Specify which documents or collections are imported or exported using paths or
  by matching regex patterns
- Control the depth of subcollections to import or export
- Limit the number of documents to export
- Import and export data as
  [NDJSON](https://en.wikipedia.org/wiki/JSON_streaming#Line-delimited_JSON) to
  a variety of different storage sources:
  - local files
  - Google Cloud Storage
  - AWS S3
  - Or implement your own data source

## Table of contents <!-- omit in toc -->

- [Installation](#installation)
  - [Peer dependencies for Google Cloud Storage](#peer-dependencies-for-google-cloud-storage)
  - [Peer dependencies for AWS S3](#peer-dependencies-for-aws-s3)
- [Usage and examples](#usage-and-examples)
  - [CLI](#cli)
  - [Node](#node)
- [Exporting data](#exporting-data)
  - [Options](#options)
  - [Logging options](#logging-options)
- [Importing data](#importing-data)
  - [Options](#options-1)
  - [Logging options](#logging-options-1)
- [Get document](#get-document)
  - [Options](#options-2)
- [List documents and collections](#list-documents-and-collections)
  - [Options](#options-3)
- [Connecting to Firestore](#connecting-to-firestore)
- [Data sources](#data-sources)
  - [Local](#local)
  - [Google Cloud Storage](#google-cloud-storage)
  - [AWS S3](#aws-s3)
  - [Creating a data source in Node](#creating-a-data-source-in-node)
  - [Custom data sources](#custom-data-sources)
- [Configuration file](#configuration-file)
- [Migration](#migration)
  - [1.x to 2.x](#1x-to-2x)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [License](#license)

## Installation

Install `firestore-backfire` and `@google-cloud/firestore` using your favourite
package manager.

```text
yarn add firestore-backfire @google-cloud/firestore
```

```text
pnpm add firestore-backfire @google-cloud/firestore
```

```text
npm install firestore-backfire @google-cloud/firestore
```

### Peer dependencies for Google Cloud Storage

If you plan to import and export data from Google Cloud Storage, you should
install:

- `@google-cloud/storage`

### Peer dependencies for AWS S3

If you plan to import and export data from S3, you should install:

- `@aws-sdk/client-s3`

Additionally, if you want to use a
[credential profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html#cli-configure-files-where)
to run this program, you should also install:

- `@aws-sdk/credential-provider-ini`

## Usage and examples

### CLI

**Firestore Backfire** can be called on the CLI using `backfire`. The aliases
`bf` and `firestore` are also provided for convenience.

If installed in your project, run it using your package manager:

```text
yarn backfire import path-to-my-data ...
```

If installed globally, you can call it directly:

```text
backfire import path-to-my-data ...
```

You can also use it in your `package.json` scripts.

```jsonc
// package.json
{
  "scripts": {
    "import-my-data": "backfire import path-to-my-data ..."
  }
}
```

#### CLI options <!-- omit in toc -->

All options listed in the documentation have a CLI flag equivalent unless
otherwise specified. The flag will always be `--` followed by the option name.
For example, the option `limit` can be passed on the CLI using `--limit`. In
most cases, a shorthand may be available. Use the `backfire [command] --help`
command to see the available options and their repsective flags.

#### CLI examples <!-- omit in toc -->

**Export documents...**

- to a file called `emails.ndjson` in an S3 bucket called `bucket`, using the
  AWS credentials profile named `default`
- from a Firestore project called `demo` using the credentials found at
  `key.json`
- from the `emails` and `messages` collection

```text
backfire export s3://bucket/emails --awsProfile default -P demo -K key.json --paths emails messages --awsRegion us-east-1
```

**Export documents...**

- to a local file called `emails.ndjson` in the `export` folder
- from a Firestore project called `demo` using the credentials found at
  `key.json`
- from the `emails` collection
- where the document id starts with "abc" or "123"
- where the document id cannot end with "xyz"

```text
backfire export ./export/emails -P demo -K key.json --paths emails --match ^emails/abc ^emails/123 --ignore xyz$
```

**Import documents...**

- from a file called `emails.ndjson` in a Google Cloud Storage bucket called
  `bucket`, belonging to a project with the ID `gcp-demo`, using a service
  account key file called `gcp-demo.json`
- to the `demo` project in the Firestore Emulator running on port 8080
- where the document belongs to a root level collection (depth of 0)
- only import the first 10 documents
- overwrite any existing data

```text
backfire import gs://bucket/emails --gcpProject gcp-demo --gcpKeyFile gcp-demo.json -P demo -E localhost:8080 --depth 0 --limit 10 --mode overwrite
```

### Node

**Firestore Backfire** exposes functions in Node that you can use to import and
export data using a [data source](#data-sources).

<!-- prettier-ignore-start -->
```typescript
import {
  importFirestoreData,
  exportFirestoreData,
  // ...
} from "firebase-backfire";

await importFirestoreData(connection, reader, options);
await exportFirestoreData(connection, writer, options);
```
<!-- prettier-ignore-end -->

Options for specifying the Firestore instance to connect to can be provided
through the `connection` parameter. The `reader` and `writer` parameters are
[data sources](#data-sources), and the `options` parameter allow you to
configure the import/export behaviour.

## Exporting data

To export data from Firestore, use the `export` command on the CLI, or use the
`exportFirestoreData` function in Node. Each document is exported as per the
[SerializedFirestoreDocument](src/firestore/FirestoreDocument/types.ts)
interface as a line of
[NDJSON](https://en.wikipedia.org/wiki/JSON_streaming#Line-delimited_JSON).

```text
backfire export <path> [options]
```

```ts
import { exportFirestoreData } from "firestore-backfire";

await exportFirestoreData(connection, writer, options);
```

When using the CLI, `path` should point to the location where you want the data
to be exported to. This can be a path to a local file, a Google Cloud Storage
path (prefixed with `gs://`), or an S3 path (prefixed with `s3://`).

When using the `exportFirestoreData` function, the `connection` parameter can be
an instance of Firestore, or it can be an object that specifies
[options](#connecting-to-firestore) for creating a connection to Firestore. The
`writer` parameter must be an implementation of
[IDataSourceWriter](src/data-source/interface/writer.ts). See the section on
[data sources](#data-sources) for more information.

### Options

All options have a [CLI flag equivalent](#cli-options----omit-in-toc) unless
otherwise specified. Follows the
[ExportFirestoreDataOptions](src/actions/exportFirestoreData/types.ts)
interface.

| Option              | Type       | Description                                                                                                                                                                                                                             |
| ------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| paths               | `string[]` | Provide a list of paths where you want to export data from. This can be a collection path (e.g. `emails`), or a path to a document (e.g. `emails/1`). If not specified, all paths will be exported, starting from the root collections. |
| match               | `RegExp[]` | Provide a list of regex patterns that a document path must match to be exported.                                                                                                                                                        |
| ignore              | `RegExp[]` | Provide a list of regex patterns that prevent a document from being exported when its path matches any of the patterns. Takes precendence over `match`.                                                                                 |
| depth               | `number`   | Limit the subcollection depth to export documents from. Documents in the root collection have a depth of 0. If not specified, no limit is applied.                                                                                      |
| limit               | `number`   | Limit the number of documents to export. If not specified, no limit is applied.                                                                                                                                                         |
| overwrite           | `boolean`  | Overwrite any existing data at the output path. Defaults to `false`.                                                                                                                                                                    |
| update              | `number`   | The interval (in seconds) at which update logs are printed. Update logs are at the `debug` level. Defaults to `5`.                                                                                                                      |
| exploreInterval\*   | `number`   | The interval (in milliseconds) at which chunks of paths are dequeued for exploration using Firestore SDK's `listDocuments()` or `listCollections()` methods. Defaults to `10`.                                                          |
| exploreChunkSize\*  | `number`   | The chunk size to use when dequeuing paths for exploration. Defaults to `1000`.                                                                                                                                                         |
| downloadInterval\*  | `number`   | The interval (in milliseconds) at which chunks of document paths are dequeued to be filtered and downloaded from Firestore. Defaults to `1000`.                                                                                         |
| downloadChunkSize\* | `number`   | The chunk size to use when dequeueing paths for download. Defaults to `limit` if supplied, otherwise it dequeues all available paths.                                                                                                   |

\* **Advanced configuration** - default values should be suitable for most use
cases. Considered internal, so may change as implementation changes.

### Logging options

By default, only log messages at the `info` level and above are printed. Follows
the [LoggingOptions](src/actions/logging.ts) interface.

| Option  | Type      | Description                                             |
| ------- | --------- | ------------------------------------------------------- |
| debug   | `boolean` | Print debug level logs and higher.                      |
| verbose | `boolean` | Print verbose level logs and higher. Overrides `debug`. |
| quiet   | `boolean` | Silence all logs. Overrides `debug` and `verbose`.      |

## Importing data

To import data into Firestore, use the `import` command on the CLI, or use the
`importFirestoreData` function in Node. The data being imported is expected to
be in [NDJSON](https://en.wikipedia.org/wiki/JSON_streaming#Line-delimited_JSON)
format, where each line follows the
[SerializedFirestoreDocument](src/firestore/FirestoreDocument/types.ts)
interface.

```text
backfire import <path> [options]
```

```ts
import { importFirestoreData } from "firestore-backfire";

await importFirestoreData(connection, reader, options);
```

When using the CLI, `path` should point to the location where you want the data
to be imported from. This can be a path to a local file, a Google Cloud Storage
path (prefixed with `gs://`), or an S3 path (prefixed with `s3://`).

When using the `importFirestoreData` function, the `connection` parameter can be
an instance of Firestore, or it can be an object that specifies
[options](#connecting-to-firestore) for creating a connection to Firestore. The
`reader` parameter must be an implementation of
[IDataSourceReader](src/data-source/interface/reader.ts). See the section on
[data sources](#data-sources) for more information.

### Options

All options have a [CLI flag equivalent](#cli-options----omit-in-toc) unless
otherwise specified. Follows the
[ImportFirestoreDataOptions](src/actions/importFirestoreData/types.ts)
interface.

| Option            | Type                                          | Description                                                                                                                                                                                         |
| ----------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| paths             | `string[]`                                    | Provide a list of paths where you want to import data from. This can be a collection path (e.g. `emails`), or a path to a document (e.g. `emails/1`). If not specified, all paths will be imported. |
| match             | `RegExp[]`                                    | Provide a list of regex patterns that a document path must match to be imported.                                                                                                                    |
| ignore            | `RegExp[]`                                    | Provide a list of regex patterns that prevent a document from being imported if its path matches any of the patterns. Takes precendence over `match`.                                               |
| depth             | `number`                                      | Limit the subcollection depth to import documents from. Documents in the root collection have a depth of 0. If not specified, no limit is applied.                                                  |
| limit             | `number`                                      | Limit the number of documents to import. If not specified, no limit is applied.                                                                                                                     |
| mode              | `"create"` `"insert"` `"overwrite"` `"merge"` | Specify how to handle importing documents that would overwrite existing data. See the [import mode](#import-mode) section for more information. Defaults to `create`.                               |
| update            | `number`                                      | The interval (in seconds) at which update logs are printed. Update logs are at the `debug` level. Defaults to `5`.                                                                                  |
| flush\*           | `number`                                      | The interval (in seconds) at which documents are flushed to Firestore. Defaults to `1`.                                                                                                             |
| processInterval\* | `number`                                      | The interval (in milliseconds) at which documents are processed as they stream in from the data source. Defaults to `10`.                                                                           |

\* **Advanced configuration** - default values should be suitable for most use
cases. Considered internal, so may change as implementation changes.

#### Import mode <!-- omit in toc -->

The `mode` option specifies how to handle importing documents that would
overwrite existing data in Firestore. The default import mode is `create`.

- `create` mode will log an error when impporting documents that already exist
  in Firestore, and existing documents will not be modified.
- `insert` mode will only import documents that do not exist, and existing
  documents will not be modified.
- `overwrite` mode will import documents that do not exist, and completely
  overwrite any existing documents.
- `merge` mode will import documents that do not exist, and merge existing
  documents.

### Logging options

By default, only log messages at the `info` level and above are printed. Follows
the [LoggingOptions](src/actions/logging.ts) interface.

| Option  | Type      | Description                                             |
| ------- | --------- | ------------------------------------------------------- |
| debug   | `boolean` | Print debug level logs and higher.                      |
| verbose | `boolean` | Print verbose level logs and higher. Overrides `debug`. |
| quiet   | `boolean` | Silence all logs. Overrides `debug` and `verbose`.      |

## Get document

Have you ever wanted to quickly inspect or export a document as JSON from
Firestore? This CLI command can help you do just that. `path` should be a valid
Firestore document path. Prints the document as pretty JSON.

Also ensure you provide appropriate options for
[connecting to Firestore](#connecting-to-firestore).

```text
backfire get <path> [options]
```

### Options

Follows the [GetFirestoreDataOptions](src/actions/getFirestoreData/types.ts)
interface.

| Option    | Type                  | Description                                                                                                             |
| --------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| stringify | `boolean` or `number` | JSON.stringify() the output. Pass `true` to use the default indent of 2, or pass a number to specify the indent amount. |

## List documents and collections

List the paths of the documents in a collection or subcollection. `path` should
be a valid Firestore collection path.

Also ensure you provide appropriate options for
[connecting to Firestore](#connecting-to-firestore).

```text
backfire list:documents <path> [options]
```

You can also list root collections or the subcollections in a document. Leave
`path` empty to list root collections, or pass a valid Firestore document path.

```text
backfire list:collections [path] [options]
```

### Options

Follows the [ListFirestoreDataOptions](src/actions/listFirestoreData/types.ts)
interface.

| Option | Type      | Description                                                                                       |
| ------ | --------- | ------------------------------------------------------------------------------------------------- |
| count  | `boolean` | Return a count of the number of documents/collections instead of the paths.                       |
| limit  | `number`  | Limit the number of documents/collections to return. This option is ignored if `count` is `true`. |

## Connecting to Firestore

In order to read and write data to Firestore, you will need to specify some
options for the connection. Follows the
[FirestoreConnectionOptions](src/firestore/FirestoreFactory/types.ts) interface.

| Option        | Type                  | Description                                                                                                                                              |
| ------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| project       | `string`              | The ID of the Firestore project to connect to.                                                                                                           |
| keyFile       | `string`              | The path to a service account's private key JSON file.                                                                                                   |
| emulator      | `string` or `boolean` | Connect to a local Firestore emulator. Defaults to `localhost:8080`. Pass a `string` value to specify a different host. Takes precedence over `keyFile`. |
| credentials\* | `object`              | Service account credentials. Fields `client_email` and `private_key` are expected. Takes precedence over `keyFile` and `emulator`.                       |

\* Not available in the CLI.

- The `project` option is always required
- To connect to a real Firestore instance, you must specify `keyFile` or pass a
  `credentials` object (Node only)
- If you are connecting to a local Firestore emulator, you can use the
  `emulator` option

As an alternative, these options can also be provided through a
[configuration file](#configuration-file) or as environment variables. Note that
CLI options will always take precendence over environment variables.

- `GOOGLE_CLOUD_PROJECT` can be used to provide `project`
- `GOOGLE_APPLICATION_CREDENTIALS` can be used to provide `keyFile`
- `FIRESTORE_EMULATOR_HOST` can be used to provide `emulator`

In Node, you can also pass an existing instance of Firestore instead of
providing connection options.

## Data sources

A data source provides a way to to read and write data to an external location.
This pacakge comes with a few implementations, and exports interfaces for you to
implement your own ones in Node if the provided implementations do not suit your
needs.

### Local

This data source reads and writes data as local files to your machine. To use
this data source on the CLI, specify a `path` that points to a valid **file
path** (note that this is different from v1). If the path is in a directory that
does not exist, it will be created for you.

No other configuration options are required.

### Google Cloud Storage

This data source reads and writes data from a Google Cloud Storage bucket. To
use this data source on the CLI, specify a `path` beginning with `gs://`.

Credentials for reading and writing to the Google Cloud Storage bucket must also
be provided as CLI options or through a
[configuration file](#configuration-file).

| Option     | Type     | Description                                          |
| ---------- | -------- | ---------------------------------------------------- |
| gcpProject | `string` | The Google Cloud project the bucket belongs to.      |
| gcpKeyFile | `string` | Path to the service account credentials file to use. |

Alternatively, these values can also be provided through the corresponding
environment variables:

- `GOOGLE_CLOUD_PROJECT`
- `GOOGLE_APPLICATION_CREDENTIALS`

**IMPORTANT**: These environment variables are also used by
[Firestore connection options](#connecting-to-firestore). If you need to use
different credentials for connecting to Firestore and accessing Google Cloud
Storage, you can override the environment variables by passing them as CLI
options or through a [configuration file](#configuration-file).

### AWS S3

This data source reads and writes data from an S3 bucket. To use this data
source on the CLI, specify a `path` beginning with `s3://`.

Credentials for reading and writing to the S3 bucket must also be provided as
CLI options or through a [configuration file](#configuration-file). You can
choose to use either `awsProfile`, or `awsAcecssKeyId` and `awsSecretAccessKey`.
`awsRegion` is always required.

| Option             | Type     | Description                                                                                                                                                                           |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| awsProfile         | `string` | The name of the profile to use from your local AWS credentials. Requires `@aws-sdk/credential-provider-ini` to be installed.                                                          |
| awsAccessKeyId     | `string` | The access key id to use. This takes precendence over the `awsProfile` option, which means that if you provide `awsProfile` as well as access keys, the access keys will be used.     |
| awsSecretAccessKey | `string` | The secret access key to use. This takes precendence over the `awsProfile` option, which means that if you provide `awsProfile` as well as access keys, the access keys will be used. |
| awsRegion          | `string` | The AWS region to use.                                                                                                                                                                |

Alternatively, these values can also be provided through the corresponding
environment variables:

- `AWS_PROFILE`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`

### Creating a data source in Node

All provided data source implementations are registered in a default instance of
[DataSourceFactory](src/data-source/factory/DataSourceFactory.ts), which is
exposed to you in Node. You can create a reader or writer implementation
directly from the factory by calling the `createReader()` or `createWriter()`
method.

The factory will automatically select the data source to create based on the
`path` it was given. The default implementation will fall back to using the
[local](#local) data source if the path does not match any other data sources.

```ts
// Import the default factory instance
import {
  dataSourceFactory,
  importFirestoreData,
  exportFirestoreData,
} from "firestore-backfire";

const path = "s3://my-bucket/exported-data.ndjson";
const reader = await dataSourceFactory.createReader(path);
const writer = await dataSourceFactory.createWriter(path);

// Use the reader and writer
await importFirestoreData(connection, reader, options);
await exportFirestoreData(connection, writer, options);
```

### Custom data sources

There are two types of data sources: **readers** and **writers**. A reader reads
text data from a stream, whilst a writer writes lines of text data to a stream.

A data source does not need to provide both a reader and a writer, but obviously
if a reader is not provided, you cannot import data, and if a writer is not
provided, you cannot export data.

To create a data source and make it useable with **Firestore Backfire**, follow
these steps:

1. Create at least one of:
   - A class that implements the
     [IDataSourceReader](src/data-source/interface/reader.ts) interface
   - A class that implements the
     [IDataSourceWriter](src/data-source/interface/writer.ts) interface
2. Construct a [IDataSource](src/data-source/factory/DataSourceFactory.ts)
   object, in which you should define:
   - A unique `id` for the data source
   - A `match` function, which takes a `path` parameter and returns `true` if
     the path can be used with this data source.
   - A `reader` property, which can your IDataSourceReader class directly, or
     provide a function that will create an instance of it. This can be left
     empty if you do not want to import data.
   - A `writer` property, which can your IDataSourceWriter class directly, or
     provide a function that will create an instance of it. This can be left
     empty if you do not want to export data.
3. Register the data source using the `register()` method on the default
   DataSourceFactory instance (exposed as `dataSourceFactory`)

Once your data source has been registered, you can use the `createReader()` or
`createWriter()` methods on the default
[DataSourceFactory](src/data-source/factory/DataSourceFactory.ts) instance to
construct your data source.

Alternatively, you can instantiate your custom data source yourself and pass it
directly to the `importFirestoreData` or `exportFirestoreData` if you do not
need to support different path types or use the default implementations.

#### Implementation example <!-- omit in toc -->

You can always take a look at how the provided implementations are written by
looking at the [source code](src/data-source/impl), and seeing how they are
[registered](src/data-source/factory/index.ts). Below is a basic example as a
reference.

```ts
import {
  IDataSourceReader,
  IDataSourceWriter,
  dataSourceFactory,
} from "firestore-backfire";

// First define your custom implementations

class MyDataReader implements IDataSourceReader {
  // ...
}

class MyDataWriter implements IDataSourceReader {
  // ...
}

// You might want to define some custom options to use
// with your data source, such as credentials
interface MyCustomOptions {
  username?: string;
  password?: string;
}

// Then register them with the data source factory

dataSourceFactory.register<MyCustomOptions>({
  id: "custom",
  // Use this data source with any paths starting with "custom://"
  match: (path) => path.startsWith("custom://"),
  // You can tell the factory to use the class directly, which will
  // pass the `path` and `options` object to the constructor
  reader: { useClass: MyDataReader },
  // You can also tell the factory to call a function to create
  // the class, which is useful for processing options that are passed
  writer: {
    useFactory: async (path, options) => {
      // E.g. check that the required options are present
      if (!options.username) throw new Error("username is required");
      if (!options.password) throw new Error("password is required");
      // If everything is good, return an instance of your class
      return new MyDataWriter(path, options.username, options.password);
    },
  },
});

// Then create the data source using the factory
const path = "custom://my-data";
const reader = await dataSourceFactory.getReader<MyCustomOptions>(path, {
  username: "...",
  password: "...",
});
```

## Configuration file

Instead of providing options on the CLI, you can also set defaults through a
configuration file. You can use the flag `--config <path>` to point to a
specific file to use as configuration. Note that CLI options will always
override options provided through a configuration file.

**IMPORTANT**: Do not to commit any secrets in your config file to version
control.

The configuration file is loaded using
[cosmiconfig](https://github.com/davidtheclark/cosmiconfig#cosmiconfig), which
supports a wide range of configuration file formats. Some examples of supported
formats:

- .backfirerc.json
- .backfirerc.yaml
- .backfirerc.js
- backfire.config.js

Sample YAML config:

```yaml
project: demo-project
keyFile: ./service-account.json
emulator: localhost:8080
paths:
  - emails
match:
  - ^emails/123
ignore:
  - xyz$
depth: 2
```

Sample JSON config:

```json
{
  "project": "demo-project",
  "keyFile": "./service-account.json",
  "emulator": "localhost:8080",
  "paths": ["emails"],
  "match": ["^emails/123"],
  "ignore": ["xyz$"],
  "depth": 2
}
```

## Migration

### 1.x to 2.x

Firestore Backfire v2 is a rewrite of v1 to provide a more up to date and
extensible design. It provides new and improved functionality, uses NDJSON as
the data format, and no longer uses worker threads.

**Breaking changes**

- `-p` has been renamed to `-P`
- `-k` has been renamed to `-K`
- `-e` has been renamed to `-E`
- `--patterns` has been renamed to `--match`
- `--workers` has been removed as worker threads are no longer used
- `--logLevel` has been removed, use `--verbose`, `--debug` or `--silent`
  instead
- `--prettify` has been renamed to `--stringify`
- `--force` has been renamed to `--overwrite`
- `--mode` values have changed to "create", "insert", "overwrite", "merge"
- Import and export file format changed to NDJSON (not backward compatible)

**New features**

- New options:
  - `ignore` (`--ignore, -i`) to ignore paths
  - `limit` (`--limit, -l`) to limit number of documents imported/exported
  - `update` (`--update`) to specify the frequency of update messages
  - A few more advanced configuration options
- New commands:
  - `backfire get <path>` to get a document from Firestore
  - `backfire list:documents <path>` to list documents in a collection
  - `backfire list:collections [path]` to list root collections or
    subcollections
- Support for passing some options as environment variables
  - `GOOGLE_CLOUD_PROJECT`
  - `GOOGLE_APPLICATION_CREDENTIALS`
  - `AWS_PROFILE`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION`
- Ability to create custom data sources in Node
- Ability to use an existing Firestore instance in Node

## Contributing

Thanks goes to these wonderful people
([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/benyap"><img src="https://avatars.githubusercontent.com/u/19235373?v=4?s=80" width="80px;" alt=""/><br /><sub><b>Ben Yap</b></sub></a><br /><a href="https://github.com/benyap/firestore-backfire/commits?author=benyap" title="Code">💻</a> <a href="https://github.com/benyap/firestore-backfire/commits?author=benyap" title="Tests">⚠️</a> <a href="https://github.com/benyap/firestore-backfire/commits?author=benyap" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/anderjf"><img src="https://avatars.githubusercontent.com/u/1616266?v=4?s=80" width="80px;" alt=""/><br /><sub><b>Anderson José de França</b></sub></a><br /><a href="#ideas-anderjf" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the
[all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome! Please follow the
[contributing guidelines](CONTRIBUTING.md).

## Changelog

Please see [CHANGELOG.md](CHANGELOG.md).

## License

Please see [LICENSE](LICENSE).

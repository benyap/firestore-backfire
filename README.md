# 🔥 Firestore BackFire

[![npm version](https://img.shields.io/npm/v/firestore-backfire)](https://npmjs.com/package/firestore-backfire)
[![License](https://img.shields.io/github/license/benyap/firestore-backfire)](LICENSE)

Ultimate control over backing up and restoring your Firestore data! Use BackFire to
import and export data from Firestore, including the Local Firestore Emulator.

**Key features**

- Control which collections are imported/exported
- Control which documents are imported/exported based on path
- Control the depth of subcollections to import/export
- Import/export data from local files
- Import/export data from Google Cloud Storage
- (WIP) Import/export data from S3

#### ⚠️ Project is a WIP

This project is still under development. It has an unstable API and may contain bugs.
Not recommended for production use yet.

## Installation

Install the package and peer dependencies using `yarn` or `npm`.

```bash
# Using yarn
yarn add @google-cloud/firestore firestore-backfire

# Using npm
npm install @google-cloud/firestore firestore-backfire
```

### Optional peer dependencies

If you plan to import/export data from Google Cloud Storage, you must also install
the peer dependency `@google-cloud/storage`:

```bash
# Using yarn
yarn add @google-cloud/storage

# Using npm
npm install @google-cloud/storage
```

## CLI Usage

All commands are accessed through `backfire` on the CLI. Options can be provided
either as command line arguments or via a [configuration file](#configuration-file).

```
Usage: backfire [options] [command]

Ultimate control over backing up and restoring your Firestore data

Options:
  -V, --version            output the version number
  --verbose                output verbose logs
  -h, --help               display help for command

Commands:
  export [options] <path>  Export data from Firestore to the given path
  import [options] <path>  Import data to Firestore from the given path
  help [command]           display help for command
```

### Export command

The `export` command will export data from a Firestore instance. The `path` argument
must be provided, and this should be a path to one of:

- a local directory where the exported data will be created (e.g. `./data-folder`)
- a path to a GCS bucket where the exported data will be saved (e.g.
  `gs://my-gcs-bucket`)

_All other command options are listed in the_
_[shared commands options](#shared-command-options) section._

**Command reference**

```
Usage: backfire export [options] <path>

Export data from Firestore to the given path

Options:
  -P, --project <project>         the Firebase project id
  -K, --keyfile <path>            path to Firebase service account credentials JSON file
  -E, --emulator <host>           use the local Firestore emulator
  --collections [collections...]  name of the root collections to export (all collections exported if not specified)
  --patterns [regex...]           regex patterns that a document path must match to be exported
  --depth <number>                subcollection depth to export (default: 100)
  --concurrency <number>          number of concurrent processes allowed (default: 10)
  --json                          outputs data in JSON array format (only applies when exporting to local files)
  --gcs-project <project>         the Google Cloud project id (required if using GCS)
  --gcs-keyfile <path>            path to Google Cloud service account credentials JSON file (required if using GCS)
  -h, --help                      display help for command
```

### Import command

The `import` command will import data to a Firestore instance. The `path` argument
must be provided, and this should be a path to one of:

- a local directory where the data should be imported from (e.g. `./data-folder`)
- a path to a GCS bucket where data should be imported from (e.g.
  `gs://my-gcs-bucket`)

The data should be in the `.snapshot` [format](#the-snapshot-data-format) (or the
JSON version of it).

_All other command options are listed in the_
_[shared commands options](#shared-command-options) section._

**Command reference**

```
Usage: backfire import [options] <path>

Import data to Firestore from the given path

Options:
  -P, --project <project>         the Firebase project id
  -K, --keyfile <path>            path to Firebase service account credentials JSON file
  -E, --emulator <host>           use the local Firestore emulator
  --collections [collections...]  name of the root collections to import (all collections imported if not specified)
  --patterns [regex...]           regex patterns that a document path must match to be imported
  --depth <number>                subcollection depth to import (default: 100)
  --concurrency <number>          number of concurrent processes allowed (default: 10)
  --json                          import data from JSON array format (only applies when importing from local files)
  --gcs-project <project>         the Google Cloud project id (required if using GCS)
  --gcs-keyfile <path>            path to Google Cloud service account credentials JSON file (required if using GCS)
  -h, --help                      display help for command
```

### Shared command options

The following options are shared between the `import` and `export` commands.

#### `-P, --project <project>`

The Firebase project to import/export data from.

#### `-K, --keyfile <path>`

The path to service account credentials for connecting to Firestore.

For example, to connect to `my-project` using the service account credentials file
`service-account.json` in the current directory:

```bash
backfire export my-folder -P my-project -K service-account.json
```

#### `-E, --emulator <host>`

Provide the emulator host to connect to using the `--emulator` option.

For example, to connect to the emulator at `http://localhost:8080`:

```bash
backfire export my-folder -P my-project -E localhost:8080
```

The `-E, --emulator` option takes precendence over the `-K, --keyfile` option. This
means that if both options are provided, the emulator will be used.

#### `--collections [collections...]`

You can specify which root collections to import/export by using the `--collections`
option. Provide a list of space-separated collection names. If not specified, all
available collections will be imported/exported.

```
backfire export my-folder -P my-project -K service-account.json --collections users settings
```

The above command will export data from the `users` and `settings` collection,
including all subcollections.

#### `--patterns [regex...]`

You can provide a list of patterns in the form of regular expressions to filter which
documents to import/export. If more than one pattern is provided, a document must
match at least one pattern to be imported/exported. If you are providing more than
one pattern, they should be space-separated. You may need to wrap your patterns in
quotes if they include special characters, such as an asterisk (\*).

Regular expressions are parsed by
[regex-parser](https://www.npmjs.com/package/regex-parser).

```
backfire export my-folder -P my-project -K service-account.json --patterns '^logs\/[^/]*F$' '^settings'
```

The above command will only export documents from the `logs` collection with a
document id that ends with "F", in addition to any documents and documents from
subcollections from within the `settings` collection.

#### `--depth <number>`

Limit the subcollection depth to import/export. A document in a root collection has a
depth of 0. Subcollections from a document in a root collection has a depth of 1, and
so on. If not provided, all subcollections are imported/exported.

```
backfire export my-folder -P my-project -K service-account.json --depth 1
```

The above command will only export documents from any root collections and documents
up to one subcollection deep.

#### `--concurrency <number>`

Control the number of sub processes that will be used to read/write data from
Firestore. If not provided, the maximum concurrency of 10 will be used.

```
backfire export my-folder -P my-project -K service-account.json --concurrency 4
```

The above command will run the export task using 4 sub processes.

#### `--json`

The `--json` option can be specified when importing/exporting from **local files**.
This option indicates to the program to read/parse data in JSON format rather than
default `.snapshot` format. See [this section](#the-snapshot-data-format) for more
information about the `.snpahsot` format.

**Caveat**: Using the JSON format is provided for specific use cases where you want
to import/export a relatively small amount of data (e.g. a few documents which define
some settings for your app) which you want to be easily read and edited by a human.
It's not recommended to use this format for exporting your entire database,
especially if there are a lot of documents. Reason: I haven't figured out a good way
to parse JSON data from a stream, so right now it will just consume the entire file
before it parses all of it, then imports the data to Firestore. This may be improved
as a future enhancement once I figure out how solve this problem.

#### `--gcs-project <project>`

If you are importing or exporting data to a Google Cloud Storage bucket, you must
specify the Google Cloud project the bucket belongs to.

#### `--gcs-keyfile <path>`

If you are importing or exporting data to a Google Cloud Storage bucket, you must
specify a path to the service account credentials to use in order to read/write data
from the bucket.

### Configuration file

Instead of providing options on the command line, they can also be provided through a
configuration file. The configuration file can be any of the following JSON or YAML
formats:

- .backfirerc.json
- .backfirerc.yaml
- .backfirerc.js
- backfire.config.js

Sample YAML config:

```yaml
project: my-firebase-project
keyfile: ./service-account.json
emulator: localhost:8080
collections:
  - logs
  - settings
patterns:
  - ^logs\/[^/]*F$
  - ^settings
depth: 100
concurrency: 10
json: true
gcsProject: my-gcp-project
gcsKeyfile: ./service-account.json
```

Sample JSON config:

```json
{
  "project": "my-firebase-project",
  "keyfile": "./service-account.json",
  "emulator": "localhost:8080",
  "collections": ["logs", "settings"],
  "patterns": ["^logs\\/[^/]*F$", "^settings"],
  "depth": 100,
  "concurrency": 10,
  "json": true,
  "verbose": true,
  "gcsProject": "my-gcp-project",
  "gcsKeyfile": "./service-account.json"
}
```

## Road map

- [x] Import/export data from local files
- [x] Import/export data from local files as JSON
- [x] Import/export data to Google Cloud Storage
- [ ] Import/export data from AWS S3
- [x] Write tests
- [ ] Add documentation site (GitHub pages?)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

See [LICENSE](LICENSE)

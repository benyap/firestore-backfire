# 🔥 Firestore BackFire

[![npm version](https://img.shields.io/npm/v/firestore-backfire)](https://npmjs.com/package/firestore-backfire)
[![License](https://img.shields.io/github/license/benyap/firestore-backfire)](LICENSE)

Ultimate control over importing and exporting data from Firestore and the Firestore
Emulator.

**Key features**

- Control which collections are imported/exported
- Control which documents are imported/exported based on the path
- Control the depth of subcollections to import/export
- Import and export using JSON format
- Import and export data from a variety of different storage sources (local files,
  Google Cloud Storage, or AWS S3)

Please see the [changelog](CHANGELOG.md) for the latest updates.

## Installation

Install the package and peer dependencies using `yarn` or `npm`.

```sh
# Using yarn
yarn add firestore-backfire @google-cloud/firestore

# Using npm
npm install firestore-backfire @google-cloud/firestore
```

### Optional peer dependencies

If you plan to import/export data from Google Cloud Storage, you must install the
peer dependency `@google-cloud/storage`

```sh
yarn add @google-cloud/storage
```

If you plan to import/export data from AWS S3, you must install the peer dependencies
`@aws-sdk/client-s3` and `@aws-sdk/lib-storage`

```sh
yarn add @aws-sdk/client-s3 @aws-sdk/lib-storage
```

Additionally, if you want to use a credential profile from `~/.aws/credentials` to
run this program, you should also install `@aws-sdk/credential-provider-ini`

```sh
yarn add @aws-sdk/credential-provider-ini
```

## CLI Usage

All commands are accessed through `backfire` on the CLI. Options can be provided
either as command line arguments or via a [configuration file](#configuration-file).

```
Usage: backfire [options] [command]

Ultimate control over importing and exporting Firestore data

Options:
  -V, --version            output the version number
  -c, --config <path>      specify the config file to use
  -h, --help               display help for command

Commands:
  export [options] [path]  export data from Firestore
  import [options] [path]  import data into Firestore
  help [command]           display help for command
```

### Export command (default)

The `export` command will export data from a Firestore database. The `path` argument
must be provided either in the command or from a config file, and should be a path to
one of:

- a local directory where the exported data will be created (e.g. `./data-folder`)
- a path to a Google Cloud Storage bucket where the exported data will be saved (e.g.
  `gs://my-gs-bucket`)
- a path to an S3 bucket where the exported data will be saved (e.g.
  `s3://my-s3-bucket`)

**Command reference**

```
Usage: backfire export [options] <path>

export data from Firestore

Options:
  -p, --project <project>        the Firebase project to export data from
  -k, --keyfile <path>           path to Firebase service account credentials JSON file
  -e, --emulator <host>          export data from Firestore emulator if provided
  --collections <collection...>  specify root collections to export (all collections exported if not specified)
  --patterns <pattern...>        specify regex patterns that a document path must match to be exported
  --depth <number>               subcollection depth to export (root collection has depth of 0, all subcollections exported if not specified)
  --workers <number>             number of worker threads to use (determines number of export chunks, defaults to number of logical CPU cores available)
  --logLevel <level>             specify the logging level (choices: "silent", "info", "debug", "verbose")
  --prettify                     prettify the output JSON
  --force                        overwrite any existing data in the write location
  --gcpProject <project_id>      the Google Cloud project to import data from
  --gcpKeyfile <path>            path to Google Cloud service account credentials JSON file
  --awsRegion <region>           the AWS region to use
  --awsProfile <profile>         the AWS profile to use
  --awsAccessKeyId <value>       the AWS access key id
  --awsSecretAccessKey <value>   the AWS secret access key
  -h, --help                     display help for command
```

### Import command

The `import` command will import data into a Firestore database. The `path` argument
must be provided either in the command or from a config file, and should be a path to
one of:

- a local directory where the data should be imported from (e.g. `./data-folder`)
- a path to a Google Cloud Storage bucket where data should be imported from (e.g.
  `gs://my-gs-bucket`)
- a path to an AWS S3 bucket where data should be imported from (e.g.
  `s3://my-s3-bucket`)

**Command reference**

```
Usage: backfire import [options] <path>

import data into Firestore

Options:
  -p, --project <project_id>     the Firebase project to import data to
  -k, --keyfile <path>           path to Firebase service account credentials JSON file
  -e, --emulator <host>          import data into Firestore emulator if provided
  --collections <collection...>  specify root collections to export (all collections exported if not specified)
  --patterns <pattern...>        specify regex patterns that a document path must match to be exported
  --depth <number>               subcollection depth to import (root collection has depth of 0, all subcollections exported if not specified)
  --workers <number>             number of worker threads to use (defaults to number of data chunks to read)
  --logLevel <level>             specify the logging level (choices: "silent", "info", "debug", "verbose")
  --mode <write_mode>            specify whether importing existing documents should be throw an error, be merged or overwritten (choices: "create", "create-and-skip-existing", "merge", "overwrite")
  --gcpProject <project_id>      the Google Cloud project to import data from
  --gcpKeyfile <path>            path to Google Cloud service account credentials JSON file
  --awsRegion <region>           the AWS region to use
  --awsProfile <profile>         the AWS profile to use
  --awsAccessKeyId <value>       the AWS access key id
  --awsSecretAccessKey <value>   the AWS secret access key
  -h, --help                     display help for command
```

### Firestore connection options

#### `-p, --project <project_id>`

The Firebase project to import/export data from.

#### `-k, --keyfile <path>`

The path to service account credentials for connecting to Firestore.

For example, to connect to `my-project` using the service account credentials file
`service-account.json` in the current directory:

```
backfire export my-folder -P my-project -K service-account.json
```

#### `-e, --emulator <host>`

Provide the emulator host to connect to using the `--emulator` option.

For example, to connect to the emulator at `http://localhost:8080`:

```
backfire export my-folder -p my-project -e localhost:8080
```

The `-e, --emulator` option takes precendence over the `-k, --keyfile` option. This
means that if both options are provided, the emulator will be used.

### Data options

#### `--collections <collection...>`

You can specify which root collections to import/export by using the `--collections`
option. Provide a list of space-separated collection names. If not specified, all
available collections will be imported/exported.

For example, the command below exports data from the `users` and `settings`
collection, including all subcollections (unless `depth` is specified).

```
backfire export my-folder -p my-project -k service-account.json --collections users settings
```

#### `--patterns <pattern...>`

You can provide a list of patterns in the form of regular expressions to filter which
document paths to import/export. If more than one pattern is provided, a document's
path must match at least one pattern to be imported/exported. If you are providing
more than one pattern, they should be space-separated. You may need to wrap your
patterns in quotes if they include special characters, such as an asterisk (\*).
Regular expressions are parsed by
[regex-parser](https://www.npmjs.com/package/regex-parser).

For example, the command below will only export documents from the `logs` collection
with a document id that ends with "F", in addition to any documents and documents
from subcollections from within the `settings` collection.

```
backfire export my-folder -p my-project -k service-account.json --patterns '^logs\/[^/]*F$' '^settings'
```

#### `--depth <number>`

Limit the subcollection depth to import/export. A document in a root collection has a
depth of 0. Subcollections from a document in a root collection has a depth of 1, and
so on. If not specified, all subcollections are imported/exported.

For example, the command below will only export documents from any root collections
and documents up to one subcollection deep.

```
backfire export my-folder -p my-project -k service-account.json --depth 1
```

#### `--workers <number>`

Specify the number of worker threads to use to when importing and exporting. This
directly controls the number of data chunks that are generated when exporting.

If not specified, the number of logical CPU cores on the current machine will be used
when exporting, and the number of JSON files to read will be used when importing.

For example, the command below will run the export task using 4 worker threads,
resulting in the epxorted data being split across 4 JSON files.

```
backfire export my-folder -p my-project -k service-account.json --workers 4
```

#### `--logLevel silent|info|debug|verbose`

Specify the log level to output. The default log level is `info`. Use `silent` to
suppress all log output.

#### `--prettify` (export only)

Prettify the JSON output when exporting data. Note that prettifying JSON will
increase the file size.

#### `--force` (export only)

Use this flag to overwrite any existing files in the write location when exporting
data.

#### `--mode create|create-and-skip-existing|merge|overwrite` (import only)

Specify the write mode when import data into Firetore. Using `create` will cause the
import of an existing document to fail. Using `create-and-skip-existing` will only
import documents that do not exist. `merge` will merge any existing documents with
the imported data, and `overwrite` will replace any existing documents with the
imported data. The default write mode is `create-and-skip-existing`.

### Google Cloud connection options

These options are required if you are importing or exporting data from a Google Cloud
Storage bucket.

#### `--gcpProject <project_id>`

Specify the Google Cloud project the bucket belongs to.

#### `--gcpKeyfile <path>`

Specify a path to the service account credentials file to use in order to read/write
data from the bucket.

### AWS S3 connection options

The AWS region and one of the credential options are required if you are importing or
exporting data from an AWS S3 bucket.

#### `--awsRegion <region>`

Specify the AWS region to use.

#### `--awsProfile <profile>`

Specify the name of the profile to use from your local AWS credentials file at
`~/.aws/credentials`.

#### `--awsAccessKeyId <key>`, `--awsSecretAccessKey <secret>`

Specify the access key id and secret access key to use. This takes precendence over
the `--awsProfile` option, which means that if you provide an AWS profile as well as
access keys, the access keys will be used.

### Configuration file

Instead of providing options on the command line, they can also be provided through a
configuration file. Note that command line options will always override options
provided through the configuration file.

The configuration file is loaded using
[cosmiconfig](https://github.com/davidtheclark/cosmiconfig). Some examples of valid
configuration file formats:

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
gcpProject: my-gcp-project
gcpKeyfile: ./service-account.json
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
  "gcpProject": "my-gcp-project",
  "gcpKeyfile": "./service-account.json"
}
```

## Programmatic Usage

You can import this into your Node.js program from the `firebase-backfire` package
and run the import or export commands.

<!-- prettier-ignore-start -->
```typescript
import { exportFirestoreData } from "firebase-backfire";
await exportFirestoreData({ /* export options */ });
```
<!-- prettier-ignore-end -->

This package provides first-class Typescript support. Import and export options are
fully typed with documentation. They are also the same as the CLI options, so please
refer to the documentation above for information about the options.

## Contributing

Contributions are welcome, but please follow the
[contributing guidelines](CONTRIBUTING.md).

## License

See [LICENSE](LICENSE)

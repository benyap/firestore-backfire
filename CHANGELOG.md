

## [2.0.2](https://github.com/benyap/firestore-backfire/compare/v2.0.1...v2.0.2) (2022-08-21)


### Bug Fixes

* do not count failed imports as a successful import ([ba4e0c8](https://github.com/benyap/firestore-backfire/commit/ba4e0c802addd488466ed16042c3d1fc6a02aa6f))

## [2.0.1](https://github.com/benyap/firestore-backfire/compare/v2.0.0...v2.0.1) (2022-08-21)


### Bug Fixes

* export depth should be no limit by default ([9d2ce45](https://github.com/benyap/firestore-backfire/commit/9d2ce454bb8b6f3d063b69bf747eac325b45cbfa))

## [2.0.0](https://github.com/benyap/firestore-backfire/compare/v1.1.1...v2.0.0) (2022-08-21)

Firestore Backfire v2 is a rewrite of v1 to provide a more up to date and extensible design. It provides new and improved functionality, uses NDJSON as the data format, and no longer uses worker threads.

### ⚠ BREAKING CHANGES

* `-p` has been renamed to `-P`
* `-k` has been renamed to `-K`
* `-e` has been renamed to `-E`
* `--patterns` has been renamed to `--match`
* `--workers` has been removed as worker threads are no longer used
* `--logLevel` has been removed, use `--verbose`, `--debug` or `--silent`instead
* `--prettify` has been renamed to `--stringify`
* `--force` has been renamed to `--overwrite`
* `--mode` values have changed to "create", "insert", "overwrite", "merge"
* Import and export file format changed to NDJSON (not backward compatible)

### New features

* New options:
  * `ignore` (`--ignore, -i`) to ignore paths
  * `limit` (`--limit, -l`) to limit number of documents imported/exported
  * `update` (`--update`) to specify the frequency of update messages
  * A few more advanced configuration options
* New commands:
  * `backfire get <path>` to get a document from Firestore
  * `backfire list:documents <path>` to list documents in a collection
  * `backfire list:collections [path]` to list root collections or subcollections
* Support for passing some options as environment variables
  * `GOOGLE_CLOUD_PROJECT`
  * `GOOGLE_APPLICATION_CREDENTIALS`
  * `AWS_PROFILE`
  * `AWS_ACCESS_KEY_ID`
  * `AWS_SECRET_ACCESS_KEY`
  * `AWS_REGION`
* Ability to create custom data sources in Node
* Ability to use an existing Firestore instance in Node

### [1.1.1](https://github.com/benyap/firestore-backfire/compare/v1.1.0...v1.1.1) (2022-01-11)


### Documentation

* fix config example ([29b7787](https://github.com/benyap/firestore-backfire/commit/29b7787dbc3e591e14857d9cc049946a9c832268))


### Tooling

* add docs section to release notes ([efff609](https://github.com/benyap/firestore-backfire/commit/efff609c42b8af340f199391ccf723cd622bc511))

## [1.1.0](https://github.com/benyap/firestore-backfire/compare/v1.0.1...v1.1.0) (2022-01-11)


### Features

* support import/export by path instead of only top level collections ([d49fbd4](https://github.com/benyap/firestore-backfire/commit/d49fbd48c01326683f7b86123e2e7c6861b3f020))


### Bug Fixes

* incorrect import documentation ([f543dca](https://github.com/benyap/firestore-backfire/commit/f543dcaaa0e579eb60684b797679144871c8e6f1))


### Dependencies

* upgrade devDependencies ([2f05e32](https://github.com/benyap/firestore-backfire/commit/2f05e3289daf0e935d22ed52302885a1082dce6c))

### [1.0.1](https://github.com/benyap/firestore-backfire/compare/v1.0.0...v1.0.1) (2022-01-08)


### Bug Fixes

* destructuring error when no config file is present ([2817510](https://github.com/benyap/firestore-backfire/commit/2817510a34f31074287a2bc3c20952ba27d16485))

## [1.0.0](https://github.com/benyap/firestore-backfire/compare/v0.2.1...v1.0.0) (2022-01-08)


### ⚠ BREAKING CHANGES

* rewrite import and export functions using worker threads
* require `@google-cloud/firestore` to be installed as a peer dependency
* require peer dependencies to be installed to support GCP and AWS data sources
* export and import now use JSON format (no more custom `.snapshot` format)

### Features

New options available. See [README](README.md) for more details.

* `--config <path>` specify the path to the config file to use
* `--logLevel <level>` specify the logging output level
* `--prettify` prettify JSON output when exporting
* `--force` overwrite existing data when exporting
* `--mode <write_mode>` specify whether existing documents should be overwritten
* new options for AWS S3 data source
* rename Google Cloud option names
* rename `--concurrency` to `--workers`
* remove `--verbose` and `--json`

Commits:

* add S3 data source and add some new data options ([fc308b1](https://github.com/benyap/firestore-backfire/commit/fc308b191426e8f55c44bb03988846cd4fda6839))
* rewrite import and export functions using worker threads ([75d3b90](https://github.com/benyap/firestore-backfire/commit/75d3b9016abcf32868e4680ec04811e893bb5ff6))


### Internal

* update README ([edabcee](https://github.com/benyap/firestore-backfire/commit/edabcee19ecea83c4f9f6d2c293900f1eb84c4c2))


### Dependencies

* bump @commitlint/cli, @commitlint/config-conventional, @types/node ([5f56879](https://github.com/benyap/firestore-backfire/commit/5f568792840e1a7f33ff79f77da904f8b51ae71f))
* upgrade devDependencies ([4f1afdc](https://github.com/benyap/firestore-backfire/commit/4f1afdc1bc62c7424604dc63b97d0d1e949de2a7))


### Tooling

* add linting and testing frameworks ([649e431](https://github.com/benyap/firestore-backfire/commit/649e43153734787a3620a0913a3028aefa27b9bf))
* clean up tsconfig ([0c69a0a](https://github.com/benyap/firestore-backfire/commit/0c69a0a4b193935ffbd381c8c759123f96b6129f))
* publish package on releases ([351b0f2](https://github.com/benyap/firestore-backfire/commit/351b0f2fca745cc44e9ea4fe481636d2a31bf01f))
* use "deps" prefix for dependencies ([006b4da](https://github.com/benyap/firestore-backfire/commit/006b4da56f15a7bbe6782cd3049a9c6c327866ec))
* update commitlint config ([d90c4e1](https://github.com/benyap/firestore-backfire/commit/d90c4e1d7f1594fc65addb42f37f10582b73e76f))

### [0.2.1](https://github.com/benyap/firestore-backfire/compare/v0.2.0...v0.2.1) (2021-12-15)


### Internal

* update README ([09d6126](https://github.com/benyap/firestore-backfire/commit/09d61260e10399f3a89753c533858f8b8e5cb5f1))

## [0.2.0](https://github.com/benyap/firestore-backfire/compare/v0.1.0...v0.2.0) (2021-12-15)


### ⚠ BREAKING CHANGES

* rename package to firestore-backfire

### Features

* rename package to firestore-backfire ([bf70025](https://github.com/benyap/firestore-backfire/commit/bf70025be37cf39e22fc548c91624af08f121bf7))


### Tooling

* configure dependabot ([d59262a](https://github.com/benyap/firestore-backfire/commit/d59262a9156aa42e8ecbc0c7bc5009a7e6fd7c48))

## [0.1.0](https://github.com/benyap/firestore-backfire/compare/v0.0.11...v0.1.0) (2021-12-15)


### Features

* expose Firestore document types ([e015ee6](https://github.com/benyap/firestore-backfire/commit/e015ee62639f111b2eb3375dcc5ffda64b64ec85))
* make depth and concurrency optional ([3ac8e40](https://github.com/benyap/firestore-backfire/commit/3ac8e401e52a04dad69565de8db3cab15e23e459))


### Bug Fixes

* export index.ts file instead of main.ts for cjs (fixes [#4](https://github.com/benyap/firestore-backfire/issues/4)) ([9b07eb1](https://github.com/benyap/firestore-backfire/commit/9b07eb1d8560728fa8d796333b3240d0ab11ad13))


### Internal

* add emulators for testing ([ea55821](https://github.com/benyap/firestore-backfire/commit/ea55821ce3a0eacc81e98b2972f8a5547865873b))
* update changelog ([c7497dc](https://github.com/benyap/firestore-backfire/commit/c7497dc623d3026bb638352204049dca6b600a17))
* update dependencies ([471dc3d](https://github.com/benyap/firestore-backfire/commit/471dc3dfece34aa0d9a38ff5717f3300d1a09bce))
* upgrade dependencies ([ec16637](https://github.com/benyap/firestore-backfire/commit/ec16637b72d3f0aacdbcfb88ffa7378a475bbae1))
* use release-it instead of standard-version ([9dfb004](https://github.com/benyap/firestore-backfire/commit/9dfb0045acd6966477f7f202c086f1d5cd5402bd))

### [0.0.11](https://github.com/benyap/firestore-backfire/compare/v0.0.10...v0.0.11) (2021-08-10)


### Features

* add import/export from Google Cloud Storage ([6dd9f6a](https://github.com/benyap/firestore-backfire/commit/6dd9f6af8e6ce5e79bdf03fc0833e9350a93e05b))

### [0.0.10](https://github.com/benyap/firestore-backfire/compare/v0.0.9...v0.0.10) (2021-08-04)


### Bug Fixes

* --keyfile not being read from correct directory ([5a435db](https://github.com/benyap/firestore-backfire/commit/5a435db73a411016c3476dc2b2e298b443bf5a57))

### [0.0.9](https://github.com/benyap/firestore-backfire/compare/v0.0.8...v0.0.9) (2021-08-04)


### Bug Fixes

* `JSONArrayReadStream` not reading large JSON files ([5807b23](https://github.com/benyap/firestore-backfire/commit/5807b23e0f442383e1c87a3e4f5ab0ada8d543da))

### [0.0.8](https://github.com/benyap/firestore-backfire/compare/v0.0.7...v0.0.8) (2021-07-31)


### Bug Fixes

* crash when importing from non-existent folder ([803a5cd](https://github.com/benyap/firestore-backfire/commit/803a5cdc2c2ac1446d5c4c9b98128a844d59a94e))

### [0.0.7](https://github.com/benyap/firestore-backfire/compare/v0.0.6...v0.0.7) (2021-07-31)


### Bug Fixes

* make path relative to project root (try again) ([d3b94a2](https://github.com/benyap/firestore-backfire/commit/d3b94a27db9b68eeeccfc74a28c9605b88850776))

### [0.0.6](https://github.com/benyap/firestore-backfire/compare/v0.0.5...v0.0.6) (2021-07-31)


### Features

* export importAction and exportAction from module ([ec0116b](https://github.com/benyap/firestore-backfire/commit/ec0116ba2e65b36c9e2a57ff58c3e363071d26b3))


### Bug Fixes

* make path relative to project root ([aeb6ea6](https://github.com/benyap/firestore-backfire/commit/aeb6ea624d6c800ffbe8a8e584fb33f6a08b6ffd))

### [0.0.5](https://github.com/benyap/firestore-backfire/compare/v0.0.4...v0.0.5) (2021-07-31)


### Internal

* publish on tags ([cd7951c](https://github.com/benyap/firestore-backfire/commit/cd7951c27da779087ff3a1461d608e1867eea346))

### [0.0.4](https://github.com/benyap/firestore-backfire/compare/v0.0.3...v0.0.4) (2021-07-31)


### Internal

* add Github actions config ([9f74abc](https://github.com/benyap/firestore-backfire/commit/9f74abc32f800f1cfc6410c4c416fdd1cd936179))
* fix build configuration ([35c87f0](https://github.com/benyap/firestore-backfire/commit/35c87f03c075903d4282b09906507652b8534a9b))

### [0.0.3](https://github.com/benyap/firestore-backfire/compare/v0.0.2...v0.0.3) (2021-07-31)


### Features

* add ability to import data to Firestore from export files ([af1b9ce](https://github.com/benyap/firestore-backfire/commit/af1b9ce07407eab4938582ea6f6b47cd27557b2d))


### Internal

* update README ([bc06a28](https://github.com/benyap/firestore-backfire/commit/bc06a283683ee866922ae41bc48c90b7166c965e))

### [0.0.2](https://github.com/benyap/firestore-backfire/compare/v0.0.1...v0.0.2) (2021-07-30)


### Features

* add --json flag to export data to local files in JSON format ([1bc2d24](https://github.com/benyap/firestore-backfire/commit/1bc2d24c7a8852a3f9d11139c7a966ff0c279bba))
* make export action a command ([55b4b37](https://github.com/benyap/firestore-backfire/commit/55b4b37cab8cd9990307bb61ec39ceb611642aac))
* rename project to firestore-backfire ([85d9a04](https://github.com/benyap/firestore-backfire/commit/85d9a04598fc1b7a1b91aa5e0062e166e144c3b7))


### Internal

* update dependencies ([2e89758](https://github.com/benyap/firestore-backfire/commit/2e89758c348d59d772a3c5550af2cf5e0c31d2b5))

### 0.0.1 (2021-07-29)


### Features

* back up from Firestore and local emulator to local directory ([2b8a466](https://github.com/benyap/full-firestore-backup/commit/2b8a4668d54ac2b69137a8016cdf492f11eaf73a))


### Tooling

* add development tooling ([c3ae109](https://github.com/benyap/full-firestore-backup/commit/c3ae109a280ba27fbb33cb3b01e059592c5299ab))
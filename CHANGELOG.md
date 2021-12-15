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

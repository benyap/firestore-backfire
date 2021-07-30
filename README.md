# BackFire

_Ultimate control over backing up and restoring your Firestore data_

### ⚠️ Project is a WIP

This project is still under development and is not feature complete. Not recommended
for production use yet.

## Usage

This program backs up data from Firestore to a local directory (back up to remote
storage locations WIP). Support for reading from Local Firestore Emulator is
supported. Run this program on the command line.

```
Usage: firestorebackup [options] [command]

Ultimate control over backing up and restoring your Firestore data

Global Options:
  -V, --version               output the version number
  -h, --help                  display help for command
  --verbose                   output verbose logs

Commands:
  export [options] <project>  export data from Firestore
  help [command]              display help for command
```

### Export command

```
Usage: firestorebackup export [options] <project>

export data from Firestore

Options:
  -o, --out <path>                path to output directory
  -k, --keyfile <path>            path to account credentials JSON file
  --emulator <host>               back up data from Firestore emulator
  --collections [collections...]  name of the root collections to back up (all collections backed up if not specified)
  --patterns [regex...]           regex patterns that a document path must match to be backed up
  --concurrency <number>          number of concurrent processes allowed (default: 10)
  --depth <number>                subcollection depth to back up (default: 100)
  --json                          outputs data in JSON array format (only applies to local file streams)
  -h, --help                      display help for command
```

### Global options

Global options can be provided directly inline, or read from a configuration file
named any of the following:

- .backfirerc
- .backfirerc.json
- .backfirerc.yaml
- .backfirerc.yml
- .backfirerc.js
- .backfirerc.cjs
- backfire.config.js
- backfire.config.cjs

## Road map

- [ ] Restore data from file backup
- [ ] Write tests... haha
- [ ] Export data to Google Cloud Storage
- [ ] Restore data to Google Cloud Storage
- [ ] Export data to AWS S3
- [ ] Restore data to AWS S3
- [ ] Add documentation site (GitHub pages?)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

See [LICENSE](LICENSE)

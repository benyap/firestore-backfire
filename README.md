# Full Firestore Backup

> Ultimate control over backing up and restoring your Firestore data

### ⚠️ Project is a WIP

This project is still under development and is not feature complete. Not recommended
for production use yet.

## Usage

This program backs up data from Firestore to a local directory (back up to remote
storage locations WIP). Support for reading from Local Firestore Emulator is
supported. Run this program on the command line.

````
Usage: firestorebackup [options]

Options:
  -V, --version                   output the version number
  -p, --project <projectId>       the Firebase project id
  -o, --out <path>                path to output directory
  -k, --keyfile <path>            path to account credentials JSON file
  --emulator <host>               back up data from Firestore emulator
  --collections [collections...]  name of the root collections to back up (all collections backed up if not specified)
  --patterns [regex...]           regex patterns that a document path must match to be backed up
  --concurrency <number>          number of concurrent processes allowed (default: 10)
  --depth <number>                subcollection depth to back up (default: 100)
  --json                          outputs data in JSON array format (only applies to local file streams)
  --verbose                       output verbose logs
  -h, --help                      display help for command\
```

Options can be provided directly inline, or read from a configuration file named any
of the following:

- .firebasebackuprc
- .firebasebackuprc.json
- .firebasebackuprc.yaml
- .firebasebackuprc.yml
- .firebasebackuprc.js
- .firebasebackuprc.cjs
- firebasebackup.config.js
- firebasebackup.config.cjs

## Road map

- [ ] Restore data from backup
- [ ] Back up data to Google Cloud Storage
- [ ] Back up data to AWS S3

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

See [LICENSE](LICENSE).
````

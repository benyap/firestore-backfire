import { Option } from "commander";
import { CliParser } from "~/utils";

// Global options

export const ConfigOption = () =>
  new Option("-c, --config <path>", "specify the config file to use");

// Connection options

export const ProjectOption = ({ action }: { action: "import" | "export" }) =>
  new Option(
    "-P, --project <projectId>",
    action === "import"
      ? "the Firebase project to import data to"
      : "the Firebase project to export data from"
  );

export const KeyFileOption = () =>
  new Option(
    "-k, --keyFile <path>",
    "path to Firebase service account credentials file"
  );

export const EmulatorOption = () =>
  new Option(
    "-e, --emulator [host]",
    "use the Firestore emulator (defaults to `localhost:8080` if host is not specified)"
  );

// Action options

export const StringifyOption = () =>
  new Option("--stringify [indent]", "JSON.stringify the output").argParser(
    CliParser.integer({ min: 1 })
  );

export const LimitOption = ({
  countable,
  action = "get",
}: { action?: "get" | "import" | "export"; countable?: boolean } = {}) =>
  new Option(
    "-l, --limit <limit>",
    `limit the number of documents/collections to ${action}${
      countable ? " (ignored if --count is used)" : ""
    }`
  ).argParser(CliParser.integer({ min: 0 }));

export const CountOption = () =>
  new Option("-c, --count", "count the number of documents");

export const PathsOption = ({ action }: { action: "import" | "export" }) =>
  new Option("-p, --paths <path...>", `specify paths to ${action} data from`);

export const MatchOption = ({ action }: { action: "import" | "export" }) =>
  new Option(
    "-m, --match <regex...>",
    `specify regex patterns that a document path must match to be ${action}ed`
  );

export const IgnoreOption = () =>
  new Option(
    "-i, --ignore <regex...>",
    "specify regex patterns that will ignore a document if its path matches (takes precedence over --match)"
  );

export const DepthOption = ({ action }: { action: "import" | "export" }) =>
  new Option(
    "-d, --depth <number>",
    `subcollection depth to ${action} (root collection depth = 0, all subcollections ${action}ed if not specified)`
  ).argParser(CliParser.integer({ min: 0, max: 100 }));

export const OverwriteOption = () =>
  new Option(
    "-o, --overwrite",
    "overwrite any existing data at the output path"
  );

export const WriteModeOption = () =>
  new Option(
    "-w, --mode <mode>",
    "specify the behaviour when importing existing documents"
  ).choices(["create", "insert", "merge", "overwrite"]);

export const DebugOption = () =>
  new Option("-d, --debug", "print debug level logs");

export const VerboseOption = () =>
  new Option("-v, --verbose", "print verbose level logs");

export const QuietOption = () => new Option("-q, --quiet", "silence all logs");

export const UpdateRateOption = () =>
  new Option(
    "--update <seconds>",
    "interval (in seconds) at which update logs are printed"
  )
    .default(5)
    .argParser(CliParser.integer({ min: 1 }));

// Google Cloud Storage data source options

export const GcpProjectOption = () =>
  new Option(
    "--gcpProject <projectId>",
    "used with Google Cloud Storage data source"
  );

export const GcpKeyFileOption = () =>
  new Option(
    "--gcpKeyFile <path>",
    "used with Google Cloud Storage data source"
  );

// S3 data source options

export const AwsRegionOption = () =>
  new Option("--awsRegion <region>", "used with S3 data source");

export const AwsProfileOption = () =>
  new Option("--awsProfile <profile>", "used with S3 data source");

export const AwsAccessKeyIdOption = () =>
  new Option("--awsAccessKeyId <value>", "used with S3 data source");

export const AwsSecretAccessKeyOption = () =>
  new Option("--awsSecretAccessKey <value>", "used with S3 data source");

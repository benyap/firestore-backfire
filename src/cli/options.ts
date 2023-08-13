import { Option } from "commander";

import { Parser } from "./parser";

// Global options

export const ConfigOption = () =>
  new Option("-c, --config <path>", "specify the config file to use");

// Connection options

export const ProjectOption = ({
  action,
}: {
  action: "import" | "export" | "read";
}) =>
  new Option(
    "-P, --project <projectId>",
    action === "import"
      ? "the Firebase project to import data to"
      : action === "export"
      ? "the Firebase project to export data from"
      : "the Firebase project to read from",
  );

export const KeyFileOption = () =>
  new Option(
    "-K, --keyFile <path>",
    "path to Firebase service account credentials file",
  );

export const EmulatorOption = () =>
  new Option(
    "-E, --emulator [host]",
    "use the Firestore emulator (default: `localhost:8080` if host is not specified)",
  );

export const AdcOption = () =>
  new Option("--adc", "use Application Default Credentials");

// Action options

export const StringifyOption = () =>
  new Option("--stringify [indent]", "JSON.stringify the output").argParser(
    Parser.integer({ min: 1 }),
  );

export const LimitOption = ({
  countable,
  action = "get",
}: { action?: "get" | "import" | "export"; countable?: boolean } = {}) =>
  new Option(
    "-l, --limit <limit>",
    `limit the number of documents/collections to ${action}${
      countable ? " (ignored if --count is used)" : ""
    }`,
  ).argParser(Parser.integer({ min: 0 }));

export const CountOption = () =>
  new Option("-c, --count", "count the number of documents");

export const PathsOption = ({ action }: { action: "import" | "export" }) =>
  new Option("-p, --paths <path...>", `specify paths to ${action} data from`);

export const MatchOption = ({ action }: { action: "import" | "export" }) =>
  new Option(
    "-m, --match <regex...>",
    `specify regex patterns that a document path must match to be ${action}ed`,
  ).argParser(Parser.regexList());

export const IgnoreOption = () =>
  new Option(
    "-i, --ignore <regex...>",
    "specify regex patterns that will ignore a document if its path matches (takes precedence over --match)",
  ).argParser(Parser.regexList());

export const DepthOption = ({ action }: { action: "import" | "export" }) =>
  new Option(
    "-d, --depth <number>",
    `subcollection depth to ${action} (root collection depth = 0, all subcollections ${action}ed if not specified)`,
  ).argParser(Parser.integer({ min: 0, max: 100 }));

export const OverwriteOption = () =>
  new Option(
    "-o, --overwrite",
    "overwrite any existing data at the output path",
  );

export const WriteModeOption = () =>
  new Option(
    "-w, --mode <mode>",
    "specify the behaviour when importing existing documents",
  ).choices(["create", "insert", "merge", "overwrite"]);

export const DebugOption = () =>
  new Option("-d, --debug", "print debug level logs and higher");

export const VerboseOption = () =>
  new Option(
    "-v, --verbose",
    "print verbose level logs and higher (overrides --debug)",
  );

export const QuietOption = () =>
  new Option(
    "-q, --quiet",
    "silence all logs (overrides --debug and --verbose)",
  );

export const UpdateRateOption = () =>
  new Option(
    "--update <seconds>",
    "interval (in seconds) at which update logs are printed",
  )
    .default(5)
    .argParser(Parser.integer({ min: 1 }));

// Advanced config options

export const ExploreIntervalOption = () =>
  new Option("--exploreInterval <millseconds>", "see documentation").argParser(
    Parser.integer({ min: 1 }),
  );

export const ExploreChunkSizeOption = () =>
  new Option("--exploreChunkSize <size>", "see documentation").argParser(
    Parser.integer({ min: 1 }),
  );

export const DownloadIntervalOption = () =>
  new Option("--downloadInterval <millseconds>", "see documentation").argParser(
    Parser.integer({ min: 1 }),
  );

export const DownloadChunkSizeOption = () =>
  new Option("--downloadChunkSize <size>", "see documentation").argParser(
    Parser.integer({ min: 1 }),
  );

export const FlushOption = () =>
  new Option("--flush <seconds>", "see documentation").argParser(
    Parser.integer({ min: 1 }),
  );

export const ProcessIntervalOption = () =>
  new Option("--processInterval <size>", "see documentation").argParser(
    Parser.integer({ min: 1 }),
  );

export const ProcessLimitOption = () =>
  new Option("--processLimit <limit>", "see documentation").argParser(
    Parser.integer({ min: 1 }),
  );

// Google Cloud Storage data source options

export const GcpProjectOption = () =>
  new Option(
    "--gcpProject <projectId>",
    "used with Google Cloud Storage data source",
  );

export const GcpKeyFileOption = () =>
  new Option(
    "--gcpKeyFile <path>",
    "used with Google Cloud Storage data source",
  );

export const GcpAdcOption = () =>
  new Option("--gcpAdc", "used with Google Cloud Storage data source");

// S3 data source options

export const AwsRegionOption = () =>
  new Option("--awsRegion <region>", "used with S3 data source");

export const AwsProfileOption = () =>
  new Option("--awsProfile <profile>", "used with S3 data source");

export const AwsAccessKeyIdOption = () =>
  new Option("--awsAccessKeyId <value>", "used with S3 data source");

export const AwsSecretAccessKeyOption = () =>
  new Option("--awsSecretAccessKey <value>", "used with S3 data source");

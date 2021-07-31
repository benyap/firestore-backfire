export interface GlobalOptions {
  verbose?: boolean;
}

export interface SharedOptions {
  project: string;
  concurrency: number;
  depth: number;
  keyfile?: string;
  emulator?: string;
  collections?: string[];
  patterns?: string[];
}

export interface ExportOptions extends SharedOptions {
  json?: boolean;
}

export interface ImportOptions extends SharedOptions {}

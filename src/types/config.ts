export interface GlobalOptions {
  verbose?: boolean;
}

export interface ExportOptions {
  out: string;
  concurrency: number;
  depth: number;
  json?: boolean;
  keyfile?: string;
  emulator?: string;
  collections?: string[];
  patterns?: string[];
}

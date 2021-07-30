import { LogLevel } from "./logging";

import type { ExportOptions } from "./config";

export type ToParentMessage =
  | LogMessage
  | CollectionPathMessage
  | DocumentPathCompleteMessage
  | FatalErrorMessage;

export interface LogMessage {
  type: "log";
  level: LogLevel;
  message: string;
  data?: any;
}

export interface CollectionPathMessage {
  type: "path";
  path: string;
}

export interface DocumentPathCompleteMessage {
  type: "document-complete";
  path: string;
}

export interface FatalErrorMessage {
  type: "fatal-error";
  message: string;
}

export type ToChildMessage = ExportOptionsMessage | DocumentMessage | KillMessage;

export interface ExportOptionsMessage {
  type: "config-export";
  identifier: string | number;
  project: string;
  options: ExportOptions;
}

export interface DocumentMessage {
  type: "document";
  id: string;
  root: string;
  path: string;
  data: any;
}

export interface KillMessage {
  type: "kill";
}

import { Config } from "./config";
import { LogLevel } from "./logging";

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

export type ToChildMessage = ConfigMessage | DocumentMessage | KillMessage;

export interface ConfigMessage {
  type: "config";
  identifier: string | number;
  config: Config;
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

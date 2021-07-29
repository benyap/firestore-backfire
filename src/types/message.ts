import { Config } from "./config";
import { LogLevel } from "./logging";

export type ParentMessage =
  | LogMessage
  | CollectionPathMessage
  | DocumentPathCompleteMessage;

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

export type ChildMessage = DocumentMessage | ConfigMessage | FinishMessage;

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

export interface FinishMessage {
  type: "finish";
}

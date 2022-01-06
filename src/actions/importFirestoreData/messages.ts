export type ImportMessageToWorker =
  | {
      type: "do-import-object";
      path: string;
    }
  | {
      type: "close-stream-and-exit";
    };

export type ImportMessageToParent =
  | {
      type: "notify-import-object-start";
      path: string;
      from: string;
    }
  | {
      type: "notify-import-object-finish";
      path: string;
      from: string;
    }
  | {
      type: "notify-early-exit";
      reason: any;
      from: string;
    };

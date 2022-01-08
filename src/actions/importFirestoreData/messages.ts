export type ImportMessageToWorker =
  | {
      type: "do-import-object";
      path: string;
    }
  | {
      type: "exit";
    };

export type ImportMessageToParent =
  | {
      type: "notify-import-object-start";
      path: string;
      identifier: string;
    }
  | {
      type: "notify-import-object-finish";
      path: string;
      identifier: string;
    }
  | {
      type: "notify-early-exit";
      reason: any;
      identifier: string;
      currentPath?: string;
      pendingPaths?: string[];
    }
  | {
      type: "notify-safe-exit";
      identifier: string;
    };

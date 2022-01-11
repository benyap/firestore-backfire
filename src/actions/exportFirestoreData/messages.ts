export type ExportMessageToWorker =
  | {
      type: "do-explore-path";
      path: string;
    }
  | {
      type: "close-stream-and-exit";
    };

export type ExportMessageToParent =
  | {
      type: "do-explore-document-subcollections";
      identifier: string;
      path: string;
    }
  | {
      type: "notify-explore-path-start";
      identifier: string;
      path: string;
    }
  | {
      type: "notify-explore-path-finish";
      identifier: string;
      path: string;
    }
  | {
      type: "notify-early-exit";
      identifier: string;
      reason: any;
      currentPath?: string;
      pendingPaths?: string[];
    }
  | {
      type: "notify-safe-exit";
      identifier: string;
    };

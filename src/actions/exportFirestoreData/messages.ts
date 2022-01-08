export type ExportMessageToWorker =
  | {
      type: "do-explore-collection";
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
      type: "notify-explore-collection-start";
      identifier: string;
      path: string;
    }
  | {
      type: "notify-explore-collection-finish";
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

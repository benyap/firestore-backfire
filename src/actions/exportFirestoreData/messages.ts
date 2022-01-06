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
      path: string;
      from: string;
    }
  | {
      type: "notify-explore-collection-start";
      path: string;
      from: string;
    }
  | {
      type: "notify-explore-collection-finish";
      path: string;
      from: string;
    }
  | {
      type: "notify-early-exit";
      reason: any;
      from: string;
    };

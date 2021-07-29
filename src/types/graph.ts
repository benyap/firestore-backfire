export interface CollectionGraphNode {
  path: string;
  subcollections?: CollectionGraphNode[];
}

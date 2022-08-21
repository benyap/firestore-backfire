import type { Timestamp } from "@google-cloud/firestore/build/src/timestamp";
import type { GeoPoint } from "@google-cloud/firestore/build/src/geo-point";

// @ts-ignore
import type {
  DocumentReference,
  Query,
  QueryOptions,
} from "@google-cloud/firestore/build/src/reference";

import * as protos from "@google-cloud/firestore/build/protos/firestore_v1_proto_api";

import api = protos.google.firestore.v1;

export interface SerializedFirestoreDocument<T = any> {
  /** The document path in Firestore. */
  path: string;
  /** The serialized document data. */
  data: T;
  /** Paths to fields that were Firestore timestamps. */
  timestamps?: string[];
  /** Paths to fields that were Firestore geopoints. */
  geopoints?: string[];
  /** Paths to fields that were Firestore document references. */
  documents?: string[];
  /** Paths to fields that were Firestore collection references and queries. */
  queries?: string[];
}

export interface DeserializedFirestoreDocument<T = any> {
  /** The document path in Firestore. */
  path: string;
  /** The deserialized document data. */
  data: T;
}

/**
 * Internal implementation: {@link Timestamp}
 */
export interface SerializedTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

/**
 * Internal implementation: {@link GeoPoint}
 */
export interface SerializedGeoPoint {
  _latitude: number;
  _longitude: number;
}

/**
 * Internal implementation: {@link DocumentReference}
 */
export interface SerializedDocumentReference {
  _firestore: _Firestore;
  _path: _Path;
  // _converter: any;
}

/**
 * Internal implementation: {@link Query}
 */
export interface SerializedQuery {
  _firestore: _Firestore;
  /** Internal implementation: {@link QueryOptions} */
  _queryOptions: {
    parentPath: _Path;
    collectionId: string;
    // converter: any;
    // allDescendants: boolean;
    fieldFilters: _FieldFilter[];
    fieldOrders: _FieldOrder[];
    startAt?: _QueryCursor;
    endAt?: _QueryCursor;
    limit?: number;
    limitType?: _LimitType;
    offset?: number;
    projection?: api.StructuredQuery.IProjection;
    // kindless: boolean;
    // requireConsistency: boolean;
  };
  // _serializer: { allowUndefined: boolean };
  // _allowUndefined: boolean;
}

type _Firestore = { projectId: string };
type _Path = { segments: string[] };

type _FieldFilter = {
  field: _Path;
  op: api.StructuredQuery.FieldFilter.Operator;
  value: any;
};

type _FieldOrder = {
  field: _Path;
  direction: api.StructuredQuery.Direction;
};

type _QueryCursor = {
  before: boolean;
  values: api.IValue[];
};

enum _LimitType {
  First = 0,
  Last = 1,
}

export type FirestoreProtoValueDefinition = api.IValue;
export type FirestoreProtoValue =
  | string
  | number
  | boolean
  | any[]
  | { [key: string]: any }
  | Timestamp
  | Uint8Array
  | GeoPoint
  | null;

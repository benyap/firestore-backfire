export interface SerializedFirestoreDocument<T = any> {
  path: string;
  data: T;
  timestamps?: string[];
  geopoints?: string[];
  references?: string[];
}

export interface DeserializedFirestoreDocument<T = any> {
  path: string;
  data: T;
}

export interface SerializedTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export interface SerializedGeoPoint {
  _latitude: number;
  _longitude: number;
}

export interface SerializedReference {
  _firestore: {
    projectId: string;
  };
  _path: {
    segments: string[];
  };
  _converter: {};
}

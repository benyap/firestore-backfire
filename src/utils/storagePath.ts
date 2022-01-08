const GS_PREFIX = /^gs:\/\//;
const S3_PREFIX = /^s3:\/\//;

export function stripPrefix(type: "gs" | "s3", path: string): string {
  switch (type) {
    case "gs":
      return path.replace(GS_PREFIX, "");
    case "s3":
      return path.replace(S3_PREFIX, "");
    default:
      return path;
  }
}

export function bucketFromPath(type: "gs" | "s3", path: string): string {
  const pathWithoutPrefix = stripPrefix(type, path);
  return pathWithoutPrefix.slice(0, pathWithoutPrefix.indexOf("/"));
}

export function keyFromPath(type: "gs" | "s3", path: string): string {
  const pathWithoutPrefix = stripPrefix(type, path);
  return pathWithoutPrefix.slice(pathWithoutPrefix.indexOf("/") + 1);
}

import { StorageSourceOptions } from "~/services";

export function pathType(path: string | undefined): StorageSourceOptions["type"] {
  if (path?.startsWith("s3://")) return "s3";
  if (path?.startsWith("gs://")) return "gs";
  return "local";
}

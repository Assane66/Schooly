import { createHash } from "node:crypto";

export type CloudinaryUploadSignature = {
  folder: string;
  signature: string;
  timestamp: number;
};

export function createCloudinaryUploadSignature(
  folder: string,
  apiSecret: string,
  timestamp = Math.floor(Date.now() / 1000),
): CloudinaryUploadSignature {
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  return { folder, signature, timestamp };
}

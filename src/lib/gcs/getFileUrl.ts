import { bucket } from "./gcs";

export const getFileUrl = async function getFileDownloadUrl(
  fileName: string,
): Promise<string> {
  const file = bucket.file(fileName);

  const signedUrl = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 604800 * 1000,
  });

  return signedUrl[0];
};

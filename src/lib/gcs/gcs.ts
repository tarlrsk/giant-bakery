import { Storage } from "@google-cloud/storage";

const GCS_PROJECT_ID = process.env.GCS_PROJECT_ID;
const GCS_KEYFILE = process.env.GCS_KEYFILE;
const GCS_BUCKET = process.env.GCS_BUCKET as string;

const storage = new Storage({
  projectId: GCS_PROJECT_ID,
  keyFilename: GCS_KEYFILE,
});

const bucket = storage.bucket(GCS_BUCKET);

export { bucket };

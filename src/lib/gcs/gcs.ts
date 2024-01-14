import { Storage } from "@google-cloud/storage";

const GCS_PROJECT_ID = process.env.GCS_PROJECT_ID;
const GCS_BUCKET = process.env.GCS_BUCKET as string;

const storage = new Storage({
  projectId: GCS_PROJECT_ID,
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: process.env.GCS_PRIVATE_KEY,
  },
});

const bucket = storage.bucket(GCS_BUCKET);

export { bucket };

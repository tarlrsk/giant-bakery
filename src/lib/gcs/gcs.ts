import { Storage } from "@google-cloud/storage";
import path from "path";

const GCS_PROJECT_ID = process.env.GCS_PROJECT_ID;
const GCS_BUCKET = process.env.GCS_BUCKET as string;
const GCS_PRIVATE_KEY = process.env.GCS_PRIVATE_KEY;
const GCS_CLIENT_EMAIL = process.env.GCS_CLIENT_EMAIL;

let credentials: any | undefined = {}

if (GCS_PRIVATE_KEY) {
  credentials = {
    client_email: GCS_CLIENT_EMAIL,
    private_key: GCS_PRIVATE_KEY,
  }
} else {
  credentials = undefined
}

const storage = new Storage({
  projectId: GCS_PROJECT_ID,
  credentials: credentials,
  keyFilename: path.resolve('gcp-service-account.json')
});

const bucket = storage.bucket(GCS_BUCKET);

export { bucket };

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { onDocumentDeleted } from "firebase-functions/v2/firestore";

initializeApp();
getFirestore().settings({ ignoreUndefinedProperties: true });

const storage = getStorage();

/* Database Triggers */

export const deleteInfluencerFiles = onDocumentDeleted(
  "influencers/{docId}",
  ({ document }) => deleteStorageDirectory(document),
);

export const deleteExpertFiles = onDocumentDeleted(
  "experts/{docId}",
  ({ document }) => deleteStorageDirectory(document),
);

export const deleteBrandFiles = onDocumentDeleted(
  "brands/{docId}",
  ({ document }) => deleteStorageDirectory(document),
);

export const deleteCategoryFiles = onDocumentDeleted(
  "categories/{docId}",
  ({ document }) => deleteStorageDirectory(document),
);

/* Utils */

async function deleteStorageDirectory(path: string) {
  const [files] = await storage.bucket().getFiles({ prefix: path });
  return Promise.all(files.map(async (file) => file.delete()));
}

// TODO remove unused page messages, media and constants if config changes

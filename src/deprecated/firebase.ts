import * as admin from "firebase-admin";
import { getApps } from "firebase-admin/app";

import { env } from "@/env";

if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

export const db = admin.firestore();

export const bucket = admin
  .storage()
  .bucket("swissinfluence-86ce8.firebasestorage.app");

export type { firestore } from "firebase-admin";

// export const migrate = async () => {
//   const docs = await db
//     .collection("awards")
//     .get()
//     .then((snapshot) => snapshot.docs);
//
//   for (const doc of docs) {
//     const { ranking } = AwardDocumentSchema.parse(doc.data());
//     if (!ranking) {
//       console.log(doc.id);
//       return;
//     }
//
//     for (const cat of Object.values(ranking)) {
//       if (!cat.winnerImage) return;
//
//       const image = await fetch(cat.winnerImage.src).then((res) =>
//         res.arrayBuffer(),
//       );
//
//       const placeholder = await sharp(image).resize(10).toBuffer();
//       const base64 = placeholder.toString("base64");
//       const blurDataURL = `data:image/png;base64,${base64}`;
//       delete cat.winnerImage.title;
//       delete cat.winnerImage.type;
//       cat.winnerImage.blurDataURL = blurDataURL;
//     }
//
//     //
//     //
//
//     await doc.ref.update({
//       ranking,
//     } as Partial<IAwardDocument>);
//     console.log("updated", doc.id);
//   }
//   console.log("DONE");
// };

// migrate();

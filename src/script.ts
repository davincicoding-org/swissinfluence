import "dotenv/config";

import { db } from "@/database";

const rows = await db.query.certifiedInfluencers.findMany();

rows.forEach((row) => {
  if (row.image.width > 2000) return;
  console.log(
    `https://swissinfluence.ch/admin/certified_influencers/${row.id}`,
  );
});

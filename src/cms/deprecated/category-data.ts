import { unstable_cache } from "next/cache";

import { db } from "@/database/firebase";

import type { ICategoryDocument } from "./category-schema";
import { CategoryDocumentSchema } from "./category-schema";

export const getCategories = unstable_cache(
  (): Promise<Array<ICategoryDocument>> =>
    db
      .collection("categories")
      .get()
      .then(({ docs }) =>
        docs.map((doc) => CategoryDocumentSchema.parse(doc.data())),
      ),
  [],
  { tags: ["cms"] },
);

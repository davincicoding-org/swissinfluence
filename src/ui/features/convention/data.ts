import type { ImageMedia } from "@davincicoding/cms/image";
import { unstable_cache } from "next/cache";

import { type SocialMedia, type Translatable } from "@/cms/common";
import { ConventionDocumentSchema } from "@/cms/resources/convention/schema";
import { BrandDocumentSchema } from "@/cms/resources/deprecated/brands-schema";
import { ExpertDocumentSchema } from "@/cms/resources/deprecated/expert-schema";
import { db } from "@/database/firebase";

export interface IConventionPageData {
  event: IConventionEvent | null;
  // speakers: Array<ISpeaker>;
  partners: Array<IConventionPartner>;
}

export interface IConventionEvent {
  date: string;
  location: {
    name: string;
    city: string;
    mapsURL: string;
  };
  schedule: Array<{
    title: Translatable;
    start: string;
    end: string;
    room: string | null;
    description: Translatable;
  }>;

  ticketSale: {
    url: string | null;
    open: boolean;
  };
}

export interface ISpeaker {
  id: string;
  name: string;
  image: ImageMedia;
  description: Translatable;
  socials: Array<SocialMedia>;
}

export interface IConventionPartner {
  id: string;
  name: string;
  url: string;
  image: ImageMedia;
}

export const fetchConventionPageData =
  async (): Promise<IConventionPageData> => {
    /* Common Documents */

    const [latestConvention] = await db
      .collection("conventions")
      .orderBy("date", "desc")
      .limit(1)
      .get()
      .then(({ docs }) =>
        docs.map((doc) => ConventionDocumentSchema.parse(doc.data())),
      );

    if (!latestConvention) return { event: null, partners: [] };

    /* Current Award */

    const _speakers = await Promise.all(
      latestConvention.speakers.map((id) =>
        db
          .collection("experts")
          .doc(id)
          .get()
          .then((doc) => {
            if (!doc.exists) throw new Error(`Could not find expert: ${id}`);
            const speaker = ExpertDocumentSchema.parse(doc.data());
            return {
              id: speaker.id,
              name: speaker.name,
              description: speaker.description,
              image: speaker.image,
              socials: speaker.socials,
            };
          }),
      ),
    );

    const partners = (
      await Promise.all(
        latestConvention.partners.map((id) =>
          db
            .collection("brands")
            .doc(id)
            .get()
            .then((doc) => {
              if (!doc.exists) return undefined;
              const brand = BrandDocumentSchema.parse(doc.data());
              return {
                id: brand.id,
                name: brand.name,
                image: brand.image,
                url: brand.website,
              };
            }),
        ),
      )
    ).filter((brand): brand is IConventionPartner => brand !== undefined);

    return {
      event: {
        date: latestConvention.date,
        location: latestConvention.location,
        schedule: latestConvention.schedule,
        ticketSale: latestConvention.ticketSale,
      },
      partners,
    };
  };

export const getConventionPageData = unstable_cache(
  fetchConventionPageData,
  [],
  {
    tags: ["cms"],
  },
);

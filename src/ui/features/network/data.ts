import type { ImageAsset, ImageMedia } from "@davincicoding/cms/image";
import { unstable_cache } from "next/cache";
import { groupBy } from "lodash-es";

import type { IBrandDocument } from "@/cms/resources/deprecated/brands-schema";
import type { ICampaignDocument } from "@/cms/resources/deprecated/campaigns-schema";
import type { ICertifiedIInfluencerDocument } from "@/cms/resources/deprecated/certified-influencer-schema";
import type { IEventDocument } from "@/cms/resources/event/schema";
import { type SocialMedia, type Translatable } from "@/cms/common";
import { getCategories } from "@/cms/resources/category/category-data";
import { type ICategoryDocument } from "@/cms/resources/category/category-schema";
import { AgencyDocumentSchema } from "@/cms/resources/deprecated/agency-schema";
import { BrandDocumentSchema } from "@/cms/resources/deprecated/brands-schema";
import { CampaignDocumentSchema } from "@/cms/resources/deprecated/campaigns-schema";
import { CertifiedInfluencerDocumentSchema } from "@/cms/resources/deprecated/certified-influencer-schema";
import { InfluencerDocumentSchema } from "@/cms/resources/deprecated/influencer-schema";
import { EventDocumentSchema } from "@/cms/resources/event/schema";
import { db } from "@/database/firebase";
import { type SupportedLocale } from "@/i18n/config";
import { type SwissCantonCode } from "@/utils/cantons";

/* Campaigns */

export interface ICampaign
  extends Omit<ICampaignDocument, "organizer" | "image"> {
  image: ImageMedia;
  organizer: Omit<IBrandDocument, "id">;
}

export const fetchCampaigns = async (): Promise<Array<ICampaign>> => {
  const campaigns = await db
    .collection("campaigns")
    .get()
    .then(({ docs }) =>
      docs.map((doc) => CampaignDocumentSchema.parse(doc.data())),
    );

  const organizers = await Promise.all(
    Array.from(new Set(campaigns.map(({ organizer }) => organizer))).map(
      (organizerID) =>
        db
          .collection("brands")
          .doc(organizerID)
          .get()
          .then((doc) => BrandDocumentSchema.parse(doc.data())),
    ),
  );

  return campaigns.map<ICampaign>(({ organizer: organizerID, ...data }) => {
    const organizer = organizers.find((entry) => entry.id === organizerID);
    if (!organizer)
      throw new Error(
        `Organizer "${organizerID}" in campaign "${data.id}" not found`,
      );

    return {
      ...data,
      organizer,
    };
  });
};

export const getCampaigns = unstable_cache(fetchCampaigns, [], {
  tags: ["cms"],
});

/* Certified Influencers */

export interface ICertifiedInfluencer {
  id: string;
  name: string;
  thumbnail: ImageMedia;
  heroImage: ImageAsset;
  socials: Array<SocialMedia>;
  categories: Array<ICategoryDocument>;
  about: Translatable;
  residence: SwissCantonCode;
  birthdate: string;
  languages: Array<string>;
  interests: Record<SupportedLocale, Array<string>>;
}

export interface ICertifiedInfluencersByCategory {
  category: {
    id: string;
    name: Translatable;
  };
  influencers: Array<
    Pick<ICertifiedInfluencer, "id" | "name" | "socials" | "thumbnail">
  >;
}

const resolveCertifiedInfluencer = async ({
  id,
  influencerID,
  image: heroImage,
  categories,
  about,
  birthdate,
  languages,
  interests,
  residence,
}: ICertifiedIInfluencerDocument): Promise<ICertifiedInfluencer> => {
  const allCategories = await getCategories();

  const influencerDoc = await db
    .collection("influencers")
    .doc(influencerID)
    .get();
  if (!influencerDoc.exists)
    throw new Error(`Influencer "${influencerID}" not found`);

  const {
    name,
    socials,
    image: thumbnail,
  } = InfluencerDocumentSchema.parse(influencerDoc.data());

  return {
    id,
    name,
    // @ts-expect-error - poorly typed
    heroImage,
    thumbnail,
    socials,
    categories: allCategories.filter((entry) => categories.includes(entry.id)),
    about,
    birthdate,
    residence,
    languages, // .map((code) => getLanguageLabel(code, true)),
    interests: Object.entries(interests).reduce<
      Record<SupportedLocale, Array<string>>
    >(
      (acc, [locale, interest]) => ({
        ...acc,
        [locale]: interest.split("\n"),
      }),
      {
        en: [],
        de: [],
        fr: [],
        it: [],
      },
    ),
  };
};

export const getCertifiedInfluencer = async (
  id: string,
): Promise<ICertifiedInfluencer> => {
  const doc = await db.collection("certified-influencers").doc(id).get();
  if (!doc.exists) throw new Error(`Certified Influencer "${id}" not found`);

  return resolveCertifiedInfluencer(
    CertifiedInfluencerDocumentSchema.parse(doc.data()),
  );
};

// TODO cache this
export const getCertifiedInfluencers = unstable_cache(
  async (): Promise<Array<ICertifiedInfluencersByCategory>> => {
    const influencers = await db
      .collection("certified-influencers")
      .get()
      .then(({ docs }) =>
        Promise.all(
          docs.map((doc) =>
            resolveCertifiedInfluencer(
              CertifiedInfluencerDocumentSchema.parse(doc.data()),
            ),
          ),
        ),
      );

    const influencerCategoryPairs = influencers.flatMap((influencer) =>
      influencer.categories.map((category) => ({ category, influencer })),
    );

    const grouped = groupBy(
      influencerCategoryPairs,
      (pair) => pair.category.id,
    );

    return Object.entries(grouped).map(([, pairs]) => ({
      category: pairs[0]!.category,
      influencers: pairs.map((pair) => pair.influencer),
    }));
  },
  [],
  {
    tags: ["cms", "certified-influencers"],
  },
);

/* Agency */

export interface IAgency {
  id: string;
  name: string;
  logo: string;
  image: string;
  website: string;
  email: string;
  about: Translatable;
}

// TODO cache this

export const getAgencies = unstable_cache(
  (): Promise<Array<IAgency>> =>
    db
      .collection("agencies")
      .get()
      .then(({ docs }) =>
        docs.map<IAgency>((doc) => {
          const data = AgencyDocumentSchema.parse(doc.data());

          return {
            id: data.id,
            name: data.name,
            logo: data.logo.src,
            image: data.image.src,
            about: data.about,
            website: data.website,
            email: data.email,
          };
        }),
      ),
  [],
  { tags: ["cms", "agencies"] },
);

/* Events */

export const getEvents = unstable_cache(
  (): Promise<Array<IEventDocument>> =>
    db
      .collection("events")
      .orderBy("date.from", "desc")
      .get()
      .then(({ docs }) =>
        docs.map<IEventDocument>((doc) =>
          EventDocumentSchema.parse(doc.data()),
        ),
      ),
  [],
  { tags: ["cms", "events"] },
);

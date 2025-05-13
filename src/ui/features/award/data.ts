import { unstable_cache } from "next/cache";

import { type ImageMedia } from "@/cms/lib/fields";
import { derivative } from "@/ui/utils";

import { type SocialMedia, type Translatable } from "@/cms/common";
import { AwardDocumentSchema } from "@/cms/resources/award/schema";
import {
  BrandDocumentSchema,
  type IBrandDocument,
} from "@/cms/resources/brand/schema";
import {
  CategoryDocumentSchema,
  type ICategoryDocument,
} from "@/cms/resources/category/schema";
import {
  CreatorChallengeDocumentSchema,
  type ICreatorChallengeDocument,
} from "@/cms/resources/creator-challenge/schema";
import { ExpertDocumentSchema } from "@/cms/resources/expert/schema";
import {
  type IInfluencerDocument,
  InfluencerDocumentSchema,
} from "@/cms/resources/influencer/schema";
import { db } from "@/database/firebase";
import { isPreview } from "@/cms/preview";

export interface IAwardPageData {
  pastAward: IPastAward | undefined;
  currentAward: ICurrentAward | undefined;
  hallOfFame: Array<IAwardRanking>;
  campaigns: Array<ICreatorChallenge>;
}

export interface IPastAward {
  year: number;
  images: Array<string>;
  afterMovie: string;
}

export interface ICurrentAward {
  year: number;
  jury: Array<IJuryMember>;
  partners: Array<IAwardPartner>;
  nomination?: {
    deadline: string;
    url: string;
  };
  newcomerScout?: {
    deadline: string;
    url: string;
  };
  nominees?: Array<IAwardNominees>;
  voting?: {
    deadline: string;
  };
  show?: IAwardShow;
  ranked?: boolean;
  impressions?: {
    images: Array<string>;
    afterMovie: string;
  };
}

export interface IAwardNominees {
  category: IAwardCategory;
  nominees: Array<IInfluencer>;
}

export interface IAwardCategory {
  id: string;
  name: Translatable;
  image?: ImageMedia;
  sponsor?: IAwardCategorySponsor;
}

export interface IAwardCategorySponsor {
  id: string;
  name: string;
  url: string;
  image: ImageMedia;
}

export interface IAwardPartner {
  id: string;
  name: string;
  url: string;
  image: ImageMedia;
}

export interface IAwardShow {
  date: string | null;
  location: {
    name: string;
    city: string;
    mapsURL: string;
  };
  schedule: Array<{
    title: Translatable;
    start: string | null;
    end: string | null;
    description: Translatable;
  }>;

  ticketSale: {
    url: string | null;
    open: boolean;
  };
}

export interface IAwardRanking {
  year: number;
  categories: Array<IAwardCategoryRanking>;
}

interface IAwardCategoryRanking {
  category: Omit<IAwardCategory, "sponsor">;
  ranking: Array<IInfluencer>;
}

export interface IInfluencer {
  id: string;
  name: string;
  image: ImageMedia;
  socials: Array<SocialMedia>;
}

export interface IJuryMember {
  id: string;
  name: string;
  image: ImageMedia;
  description: Translatable;
  socials: Array<SocialMedia>;
}

export interface ICreatorChallenge
  extends Omit<ICreatorChallengeDocument, "organizer" | "image"> {
  image: ImageMedia;
  organizer: Omit<IBrandDocument, "id">;
}

export const fetchAwardPageData = async (): Promise<IAwardPageData> => {
  const campaigns = await fetchCampaigns();

  /* Common Documents */

  const awards = await db
    .collection("awards")
    .orderBy("year", "desc")
    .get()
    .then(({ docs }) =>
      docs.map((doc) => AwardDocumentSchema.parse(doc.data())),
    );

  const [latestAward] = awards;

  const categories = await db
    .collection("categories")
    .get()
    .then(({ docs }) =>
      docs.map((doc) => CategoryDocumentSchema.parse(doc.data())),
    );

  const resolveCategory = (categoryID: ICategoryDocument["id"]) => {
    const category = categories.find(({ id }) => id === categoryID);
    if (category === undefined)
      throw new Error(`Could not find category: ${categoryID})`);
    return {
      id: category.id,
      name: category.name,
      image: category.image ?? undefined,
    };
  };

  const allInfluencersIDs = [
    ...(latestAward?.categories ?? []).flatMap(({ nominees }) => nominees),
    ...awards.flatMap(({ ranking }) =>
      Object.values(ranking ?? {}).flatMap(
        (categoryRanking) => categoryRanking.ranking,
      ),
    ),
  ];

  const influencers = await Promise.all(
    allInfluencersIDs.map((id) =>
      db
        .collection("influencers")
        .doc(id)
        .get()
        .then((doc) => {
          if (!doc.exists) throw new Error(`Could not find influencer: ${id}`);
          return InfluencerDocumentSchema.parse(doc.data());
        }),
    ),
  );

  const resolveInfluencer = (
    influencerID: IInfluencerDocument["id"],
  ): IInfluencer => {
    const influencer = influencers.find(({ id }) => id === influencerID);
    if (influencer === undefined)
      throw new Error(`Could not find influencer: ${influencerID}`);
    return {
      id: influencer.id,
      name: influencer.name,
      image: influencer.image,
      socials: influencer.socials,
    };
  };

  /* Hall of Fame */

  const hallOfFame: IAwardPageData["hallOfFame"] = awards.reduce<
    Array<IAwardRanking>
  >((acc, award) => {
    const categoryRankings = award.categories
      .map<IAwardCategoryRanking | null>(({ category: categoryID }) => {
        const category = resolveCategory(categoryID);
        const categoryRanking = award.ranking?.[categoryID];
        if (!categoryRanking) return null;

        const rankedInfluencers = categoryRanking.ranking.map<IInfluencer>(
          (influencerID, index) => {
            const influencer = resolveInfluencer(influencerID);
            if (index !== 0) return influencer;
            if (!categoryRanking.winnerImage) return influencer;
            return {
              ...influencer,
              image: categoryRanking.winnerImage,
            };
          },
        );

        return {
          category,
          ranking: rankedInfluencers,
        };
      })
      .filter((item): item is IAwardCategoryRanking => item !== null);

    if (categoryRankings.length === 0) return acc;

    return [
      ...acc,
      {
        year: award.year,
        categories: categoryRankings,
      },
    ];
  }, []);

  /* Current Award */

  const currentAward = await derivative<Promise<ICurrentAward | undefined>>(
    async () => {
      const [award] = awards;
      if (!award) return undefined;

      const jury = await Promise.all(
        award.jury.map((id) =>
          db
            .collection("experts")
            .doc(id)
            .get()
            .then((doc) => {
              if (!doc.exists) throw new Error(`Could not find expert: ${id}`);
              const juryMember = ExpertDocumentSchema.parse(doc.data());
              return {
                id: juryMember.id,
                name: juryMember.name,
                description: juryMember.description,
                image: juryMember.image,
                socials: juryMember.socials,
              };
            }),
        ),
      );

      const partners = (
        await Promise.all(
          award.partners.map((id) =>
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
      ).filter((brand): brand is IAwardPartner => brand !== undefined);

      const sponsors = await derivative(async () => {
        const sponsorIDs = award.categories.reduce<Array<IBrandDocument["id"]>>(
          (acc, { sponsor: sponsorID }) => {
            if (!sponsorID) return acc;
            if (acc.includes(sponsorID)) return acc;
            return [...acc, sponsorID];
          },
          [],
        );

        return Promise.all(
          sponsorIDs.map<Promise<IAwardCategorySponsor>>((id) =>
            db
              .collection("brands")
              .doc(id)
              .get()
              .then((doc) => {
                if (!doc.exists) throw new Error(`Could not find brand: ${id}`);
                const brand = BrandDocumentSchema.parse(doc.data());
                return {
                  id: brand.id,
                  name: brand.name,
                  url: brand.website,
                  image: brand.image,
                };
              }),
          ),
        );
      });

      const nominees = derivative<ICurrentAward["nominees"]>(() => {
        if (!award.nomination) return undefined;
        const list = award.categories.map<IAwardNominees>(
          ({
            category: categoryID,
            nominees: categoryNominees,
            sponsor: sponsorID,
          }) => ({
            category: derivative<IAwardCategory>(() => {
              const category = resolveCategory(categoryID);
              const sponsor = sponsors.find(({ id }) => id === sponsorID);
              if (sponsorID && !sponsor)
                throw new Error(`Could not find sponsor: ${sponsorID}`);

              return {
                id: category.id,
                name: category.name,
                image: category.image,
                sponsor,
              };
            }),
            nominees: categoryNominees.map((nomineeID) =>
              resolveInfluencer(nomineeID),
            ),
          }),
        );

        if (list.every((cat) => cat.nominees.length === 0)) return undefined;

        return list.filter((cat) => cat.nominees.length > 0);
      });

      const impressions = derivative<ICurrentAward["impressions"]>(() => {
        if (!award.impressions) return undefined;
        return {
          afterMovie: award.impressions.afterMovie,
          images: award.impressions.images.map(({ src }) => src),
        };
      });

      return {
        year: award.year,
        jury,
        partners,
        nomination: award.nomination ?? undefined,
        nominees,
        newcomerScout: award.newcomerScout ?? undefined,
        voting: award.voting ?? undefined,
        show: award.show ?? undefined,
        ranked: hallOfFame.some(({ year }) => year === award.year),
        impressions,
      };
    },
  );

  /* Last Award */

  const pastAward = derivative<IPastAward | undefined>(() => {
    const award = awards.find(({ impressions }) => impressions !== null);
    if (!award?.impressions) return undefined;

    return {
      year: award.year,
      afterMovie: award.impressions.afterMovie,
      images: award.impressions.images.map(({ src }) => src),
    };
  });

  return { currentAward, pastAward, hallOfFame, campaigns };
};

export const getAwardPageData = async () => {
  if (await isPreview()) return fetchAwardPageData();
  return unstable_cache(fetchAwardPageData, [], {
    tags: ["cms"],
  })();
};

export const fetchCampaigns = async (): Promise<Array<ICreatorChallenge>> => {
  const campaigns = await db
    .collection("creator-challenges")
    .get()
    .then(({ docs }) =>
      docs.map((doc) => CreatorChallengeDocumentSchema.parse(doc.data())),
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

  return campaigns.map<ICreatorChallenge>(
    ({ organizer: organizerID, ...data }) => {
      const organizer = organizers.find((entry) => entry.id === organizerID);
      if (!organizer)
        throw new Error(
          `Organizer "${organizerID}" in campaign "${data.id}" not found`,
        );

      return {
        ...data,
        organizer,
      };
    },
  );
};

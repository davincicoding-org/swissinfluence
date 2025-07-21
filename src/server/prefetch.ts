"use server";

import type { CollectionSlug } from "payload";

import { routing } from "@/i18n/routing";

import type { PageId } from "./queries/pages";
import { fetchMessages } from "./messages";
import * as QUERIES from "./queries";

export async function prefetchData(
  changes: Partial<Record<CollectionSlug, string[]>>,
) {
  console.log("PREFETCHING DATA");
  const {
    getAgencies,
    getUpcomingAwardShows,
    getCurrentAward,
    getCreatorChallenges,
    getHallOfFame,
    getPastImpressions,
    getUpcomingNetworkEvents,
    getPage,
    getSocialMediaCampaigns,
    getLatestConvention,
    getUpcomingConvention,
    getCategoriesWithCertifiedInfluencers,
    getCertifiedInfluencer,
    fetchCertification,
    fetchCompany,
    fetchNetwork,
    ...rest
  } = QUERIES;

  for (const locale of routing.locales) {
    await fetchMessages(locale);

    await getAgencies(locale);
    await getUpcomingAwardShows(locale);
    await getCurrentAward(locale);
    await getCreatorChallenges(locale);
    await getHallOfFame(locale);
    await getUpcomingNetworkEvents(locale);
    await getSocialMediaCampaigns(locale);
    await getLatestConvention(locale);
    await getUpcomingConvention(locale);
    await getCategoriesWithCertifiedInfluencers(locale);
    await fetchCertification(locale);

    for (const page of changes.pages ?? []) {
      await getPage(page as PageId, locale);
    }

    for (const certifiedInfluencer of changes["certified-influencers"] ?? []) {
      await getCertifiedInfluencer(certifiedInfluencer, locale);
    }
  }
  await fetchCompany();
  await fetchNetwork();
  await getPastImpressions();

  checkDeconstructed(rest);
}

function checkDeconstructed(_: Record<string, never>) {
  void 0;
}

"use server";

import type { CollectionSlug } from "payload";

import { routing } from "@/i18n/routing";

import * as QUERIES from "./queries";
import { fetchMessages } from "./messages";

export async function prefetchData(
  changes: Partial<Record<CollectionSlug, string[]>>,
) {
  const {
    getAgencies,
    getCurrentAward,
    getCreatorChallenges,
    getHallOfFame,
    getPastImpressions,
    getNetworkEvents,
    getPage,
    getSocialMediaCampaigns,
    getLatestConvention,
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
    await getCurrentAward(locale);
    await getCreatorChallenges(locale);
    await getHallOfFame(locale);
    await getNetworkEvents(locale);
    await getSocialMediaCampaigns(locale);
    await getLatestConvention(locale);
    await getCategoriesWithCertifiedInfluencers(locale);
    await fetchCertification(locale);

    for (const page of changes.pages ?? []) {
      await getPage(page, locale);
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

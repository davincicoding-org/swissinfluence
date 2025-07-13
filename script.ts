import path from "path";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import type { File } from "payload";
import slugify from "slugify";

import type { Canton, Language, SocialMedia } from "@/database/enums";
import type { SupportedLocale } from "@/i18n/config";
import type { Award } from "@/payload-types";
import { env } from "@/env";
import { routing } from "@/i18n/routing";
import { getPayloadClient } from "@/server/payload";

import * as AWARDS from "./src/backup/awards.json";
import * as DATA from "./src/data";

const payload = await getPayloadClient();

// MARK: Migrations

async function migrateInfluencers() {
  for (const { id, name, image: imageUrl, socials } of DATA.INFLUENCERS) {
    try {
      console.log(`Migrating: ${name}`);

      const imageFile = await fetchLegacyImage(imageUrl, name);

      const image = await payload.create({
        collection: "profile-pictures",
        data: {},
        file: imageFile,
      });

      console.log(`Successfully uploaded image for ${name}`);

      await payload.create({
        collection: "influencers",
        data: {
          id,
          name,
          image: image.id,
          socials: socials as SocialMedia[],
        },
      });

      console.log(`Successfully migrated: ${name} (ID: ${id})`);
    } catch (error) {
      console.error(`Failed to migrate ${name}:`, error);
    }
  }
}

async function migrateExperts() {
  for (const {
    id,
    name,
    description,
    image: imageUrl,
    socials,
  } of DATA.EXPERTS) {
    try {
      console.log(`Migrating: ${name}`);

      const imageFile = await fetchLegacyImage(imageUrl, name);

      const image = await payload.create({
        collection: "profile-pictures",
        data: {},
        file: imageFile,
      });

      console.log(`Successfully uploaded image for ${name}`);

      await payload.create({
        collection: "experts",
        data: {
          id,
          name,
          image: image.id,
          description: "",
          socials: socials as SocialMedia[],
        },
      });

      for (const [locale, value] of Object.entries(description)) {
        await payload.update({
          collection: "experts",
          id,
          locale: locale as SupportedLocale,
          data: {
            description: value,
          },
        });
      }

      console.log(`Successfully migrated: ${name} (ID: ${id})`);
    } catch (error) {
      console.error(`Failed to migrate ${name}:`, error);
    }
  }
}

async function migrateBrands() {
  for (const { id, name, logo: imageUrl, website } of DATA.BRANDS) {
    try {
      console.log(`Migrating: ${name}`);

      const imageFile = await fetchLegacyImage(imageUrl, name);

      const image = await payload.create({
        collection: "logos",
        data: {},
        file: imageFile,
      });

      console.log(`Successfully uploaded image for ${name}`);

      await payload.create({
        collection: "brands",
        data: {
          id,
          name,
          logo: image.id,
          website,
        },
      });

      console.log(`Successfully migrated: ${name} (ID: ${id})`);
    } catch (error) {
      console.error(`Failed to migrate ${name}:`, error);
    }
  }
}

async function migrateLocations() {
  for (const { id, name, city, url } of DATA.LOCATIONS) {
    try {
      console.log(`Migrating: ${name}`);

      await payload.create({
        collection: "locations",
        data: {
          id,
          name,
          city,
          url,
        },
      });

      console.log(`Successfully migrated: ${name} (ID: ${id})`);
    } catch (error) {
      console.error(`Failed to migrate ${name}:`, error);
    }
  }
}

async function migrateCategories() {
  for (const { id, name, image: imageUrl } of DATA.CATEGORIES) {
    try {
      console.log(`Migrating: ${name.en}`);

      const imageFile = await fetchLegacyImage(imageUrl, name.en);

      const image = await payload.create({
        collection: "photos",
        data: {},
        file: imageFile,
      });

      console.log(`Successfully uploaded image for ${name.en}`);

      await payload.create({
        collection: "categories",
        data: {
          id,
          name: name.en,
          image: image.id,
        },
      });

      for (const [locale, value] of Object.entries(name)) {
        await payload.update({
          collection: "categories",
          id,
          locale: locale as SupportedLocale,
          data: {
            name: value,
          },
        });
      }

      console.log(`Successfully migrated: ${name.en} (ID: ${id})`);
    } catch (error) {
      console.error(`Failed to migrate ${name.en}:`, error);
    }
  }
}

async function migrateCertifiedInfluencers() {
  for (const {
    id,
    influencer,
    image: imageUrl,
    birthdate,
    languages,
    residence,
    bio,
    interests,
    categories,
  } of DATA.CERTIFIED_INFLUENCERS) {
    const influencerData = DATA.INFLUENCERS.find(({ id }) => id === influencer);

    try {
      console.log(`Migrating: ${influencerData?.name}`);

      const imageFile = await fetchLegacyImage(
        imageUrl,
        influencerData?.name ?? id.toString(),
      );

      const image = await payload.create({
        collection: "photos",
        data: {},
        file: imageFile,
      });

      console.log(`Successfully uploaded image for ${influencerData?.name}`);

      await payload.create({
        collection: "certified-influencers",
        data: {
          id,
          influencer: influencer,
          image: image.id,
          birthdate,
          languages: languages as Language[],
          residence: residence as Canton,
          bio: "",
          categories,
        },
      });

      for (const locale of routing.locales) {
        await payload.update({
          collection: "certified-influencers",
          id,
          locale,
          data: {
            bio: bio[locale],
            interests: interests?.[locale],
          },
        });
      }

      console.log(`Successfully migrated: ${influencerData?.name} (ID: ${id})`);
    } catch (error) {
      console.error(`Failed to migrate ${influencerData?.name}:`, error);
    }
  }
}

async function migrateSocialMediaCampaigns() {
  for (const {
    id,
    image: imageUrl,
    organizer,
    title,
    content,
    dateFrom,
    dateTo,
    location,
    registrationUrl,
  } of DATA.SOCIAL_MEDIA_CAMPAIGNS) {
    try {
      console.log(`Migrating: ${title.en}`);

      const imageFile = await fetchLegacyImage(imageUrl, title.en);

      const image = await payload.create({
        collection: "photos",
        data: {},
        file: imageFile,
      });

      console.log(`Successfully uploaded image for ${title.en}`);

      await payload.create({
        collection: "social-media-campaigns",
        data: {
          id,
          image: image.id,
          organizer,
          title: "",
          content: {
            root: {
              type: "doc",
              children: [],
              direction: "ltr",
              format: "",
              indent: 0,
              version: 1,
            },
          },
          dateFrom,
          dateTo,
          location,
          registrationUrl,
        },
      });

      for (const locale of routing.locales) {
        await payload.update({
          collection: "social-media-campaigns",
          id,
          locale,
          data: {
            title: title[locale],
            // TODO
            // content: HTMLToRichText(content[locale]),
          },
        });
      }

      console.log(`Successfully migrated: ${title.en} (ID: ${id})`);
    } catch (error) {
      console.error(`Failed to migrate ${title.en}:`, error);
    }
  }
}

async function migrateNetworkEvents() {
  for (const {
    id,
    image: imageUrl,
    title,
    dateFrom,
    dateTo,
    location,
    description,
    logo: logoUrl,
    registrationUrl,
  } of DATA.NETWORK_EVENTS) {
    try {
      console.log(`Migrating: ${title.en}`);

      const imageFile = await fetchLegacyImage(imageUrl, title.en);

      const image = await payload.create({
        collection: "photos",
        data: {},
        file: imageFile,
      });

      console.log(`Successfully uploaded image for ${title.en}`);

      const logoFile = await fetchLegacyImage(logoUrl, title.en);

      const logo = await payload.create({
        collection: "logos",
        data: {},
        file: logoFile,
      });

      console.log(`Successfully uploaded logo for ${title.en}`);

      await payload.create({
        collection: "network-events",
        data: {
          id,
          image: image.id,
          logo: logo.id,
          title: "",
          content: {
            root: {
              type: "doc",
              children: [],
              direction: "ltr",
              format: "",
              indent: 0,
              version: 1,
            },
          },
          dateFrom,
          dateTo,
          location,
          registrationUrl,
        },
      });

      for (const locale of routing.locales) {
        await payload.update({
          collection: "network-events",
          id,
          locale,
          data: {
            title: title[locale],
            // TODO
            // content: HTMLToRichText(description[locale]),
          },
        });
      }

      console.log(`Successfully migrated: ${title.en} (ID: ${id})`);
    } catch (error) {
      console.error(`Failed to migrate ${title.en}:`, error);
    }
  }
}

async function migrateAgencies() {
  for (const {
    id,
    name,
    image: imageUrl,
    description,
    logo: logoUrl,
    email,
    website,
  } of DATA.AGENCIES) {
    try {
      console.log(`Migrating: ${name}`);

      const imageFile = await fetchLegacyImage(imageUrl, name);

      const image = await payload.create({
        collection: "photos",
        data: {},
        file: imageFile,
      });

      console.log(`Successfully uploaded image for ${name}`);

      const logoFile = await fetchLegacyImage(logoUrl, name);

      const logo = await payload.create({
        collection: "logos",
        data: {},
        file: logoFile,
      });

      console.log(`Successfully uploaded logo for ${name}`);

      await payload.create({
        collection: "agencies",
        data: {
          id,
          image: image.id,
          logo: logo.id,
          name,
          website,
          email,
          description: "",
        },
      });

      for (const locale of routing.locales) {
        await payload.update({
          collection: "agencies",
          id,
          locale,
          data: {
            description: description[locale],
          },
        });
      }

      console.log(`Successfully migrated: ${name} (ID: ${id})`);
    } catch (error) {
      console.error(`Failed to migrate ${name}:`, error);
    }
  }
}

async function migrateCreatorChallenges() {
  for (const {
    id,
    image: imageUrl,
    organizer,
    title,
    content,
    dateFrom,
    dateTo,
    location,
    registrationUrl,
  } of DATA.CREATOR_CHALLENGES) {
    try {
      console.log(`Migrating: ${title.en}`);

      const imageFile = await fetchLegacyImage(imageUrl, title.en);

      const image = await payload.create({
        collection: "photos",
        data: {},
        file: imageFile,
      });

      console.log(`Successfully uploaded image for ${title.en}`);

      await payload.create({
        collection: "creator-challenges",
        data: {
          id,
          image: image.id,
          organizer,
          title: "",
          content: {
            root: {
              type: "doc",
              children: [],
              direction: "ltr",
              format: "",
              indent: 0,
              version: 1,
            },
          },
          dateFrom,
          dateTo,
          location,
          registrationUrl,
        },
      });

      for (const locale of routing.locales) {
        await payload.update({
          collection: "creator-challenges",
          id,
          locale,
          data: {
            title: title[locale],
            // TODO
            // content: HTMLToRichText(content[locale]),
          },
        });
      }

      console.log(`Successfully migrated: ${title.en} (ID: ${id})`);
    } catch (error) {
      console.error(`Failed to migrate ${title.en}:`, error);
    }
  }
}

async function migrateConversations() {
  for (const {
    id,
    title,
    registrationUrl,
    date,
    location,
    schedule,
    partners,
  } of DATA.CONVENTIONS) {
    try {
      console.log(`Migrating: ${title}`);

      await payload.create({
        collection: "conventions",
        data: {
          id,
          title,
          date,
          location,
          partners,
          // TODO update description manually
          schedule: schedule.map(
            ({ title, start, end, room, description }) => ({
              title: title.en,
              from: start,
              to: end,
              room,
              description: {
                root: {
                  type: "doc",
                  children: [],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  version: 1,
                },
              },
            }),
          ),
          registrationUrl,
        },
      });

      console.log(`Successfully migrated: ${title} (ID: ${id})`);
    } catch (error) {
      console.error(`Failed to migrate ${title}:`, error);
    }
  }
}

async function migrateAwards() {
  for (const {
    id,
    year,
    newcomerScoutDeadline,
    newcomerScoutUrl,
    nominationDeadline,
    nominationUrl,
    votingDeadline,
    jury,
    partners,
    categories,
  } of AWARDS) {
    try {
      console.log(`Migrating: ${year}`);

      await payload.create({
        collection: "awards",
        data: {
          id,
          year,
          categories: await (async () => {
            if (categories.length === 0) return undefined;

            const results = new Array<
              NonNullable<Award["categories"]>[number]
            >();

            for (const { category, sponsor, nominees, winner } of categories) {
              if (!winner) {
                results.push({
                  category: category.id,
                  sponsor: sponsor?.id,
                  nominees: nominees.map(({ influencer }) => ({
                    influencer: influencer.id,
                  })),
                });
                continue;
              }

              const winnerImageFile = await fetchLegacyImage(
                winner.src,
                `winner-${category.title.en}-${year}`,
              );

              const winnerImage = await payload.create({
                collection: "profile-pictures",
                data: {},
                file: winnerImageFile,
              });

              results.push({
                category: category.id,
                sponsor: sponsor?.id,
                nominees: nominees.map(({ influencer }) => ({
                  influencer: influencer.id,
                })),
                winnerImage: winnerImage.id,
              });
            }
            return results;
          })(),
          jury: jury.map(({ expert }) => ({ expert: expert.id })),
          partners: partners.map(({ brand }) => ({ brand: brand.id })),
          newcomerScoutDeadline,
          newcomerScoutUrl,
          nominationDeadline,
          nominationUrl,
          votingDeadline,
        },
      });

      console.log(`Successfully migrated: ${year} (ID: ${id})`);
    } catch (error) {
      console.error(`Failed to migrate ${year}:`, error);
    }
  }
}

async function migrateAwardShows() {
  for (const {
    id,
    award,
    tickets,
    date,
    location,
    schedule,
    video,
    impressions,
  } of DATA.AWARD_SHOWS) {
    const awardData = AWARDS.find(({ id }) => id === award);

    try {
      console.log(`Migrating: ${awardData?.year}`);

      const images = new Array<number>();
      let index = 0;

      for (const src of impressions ?? []) {
        const imageFile = await fetchLegacyImage(
          src,
          `impression-${awardData?.year}-${index}`,
        );
        const image = await payload.create({
          collection: "photos",
          data: {},
          file: imageFile,
        });

        images.push(image.id);
        index++;
      }

      await payload.create({
        collection: "award-shows",
        data: {
          id,
          award,
          date,
          location,
          // TODO update description manually
          schedule: schedule.map(({ title, start, end, description }) => ({
            title: title.en,
            from: start,
            to: end,
            description: {
              root: {
                type: "doc",
                children: [],
                direction: "ltr",
                format: "",
                indent: 0,
                version: 1,
              },
            },
          })),
          registrationUrl: tickets,
          videoUrl: video,
          images: images.length > 0 ? images : undefined,
        },
      });

      console.log(`Successfully migrated: ${awardData?.year} (ID: ${id})`);
    } catch (error) {
      console.error(`Failed to migrate ${awardData?.year}:`, error);
    }
  }
}

// MARK: Utilities

function getImageUrl(src: string) {
  return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${src}`;
}

async function fetchLegacyImage(url: string, filename: string): Promise<File> {
  const imageResponse = await fetch(url);

  if (!imageResponse.ok) {
    throw new Error(`Failed to fetch image: ${imageResponse.status}`);
  }

  const imageBuffer = await imageResponse.arrayBuffer();
  const contentType = imageResponse.headers.get("content-type") ?? "image/jpeg";

  const imageExtension = path.extname(new URL(url).pathname) || ".jpg";

  return {
    data: Buffer.from(imageBuffer),
    mimetype: contentType,
    name: `${slugify(filename, { lower: true })}${imageExtension}`,
    size: imageBuffer.byteLength,
  };
}

// TODO implement this
function HTMLToRichText(html: string): DefaultTypedEditorState | undefined {
  return undefined;
}

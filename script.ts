// import { writeFileSync } from "fs";
// import path from "path";
// import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
// import type { File } from "payload";
// import slugify from "slugify";

// import type { Canton, Language, SocialMedia } from "@/database/enums";
// import type { SupportedLocale } from "@/i18n/config";
// import type { Award } from "@/payload-types";
import { writeFileSync } from "fs";

import { db } from "@/database";
import { env } from "@/env";

// import { routing } from "@/i18n/routing";
// import { getPayloadClient } from "@/server/payload";

await db.query.videos.findMany().then((entries) => {
  writeFileSync(`src/backup/videos.json`, JSON.stringify(entries, null, 2));
});

// // TODO connect to the new database

// // await db.query.images.findMany().then((entries) => {
// //   storeEntries(entries, "images");
// // });

// // await db.query.videos.findMany().then((entries) => {
// //   storeEntries(entries, "videos");
// // });

// // await db.query.agencies.findMany().then((entries) => {
// //   storeEntries(entries, "agencies");
// // });

// // await db.query.influencers.findMany().then((entries) => {
// //   storeEntries(entries, "influencers");
// // });

// // await db.query.experts.findMany().then((entries) => {
// //   storeEntries(entries, "experts");
// // });

// // await db.query.brands.findMany().then((entries) => {
// //   storeEntries(entries, "brands");
// // });

// // await db.query.locations.findMany().then((entries) => {
// //   storeEntries(entries, "locations");
// // });

// // await db.query.categories.findMany().then((entries) => {
// //   storeEntries(entries, "categories");
// // });

// // await db.query.networkEvents
// //   .findMany({
// //     with: {
// //       location: true,
// //     },
// //   })
// //   .then((entries) => {
// //     storeEntries(entries, "network-events");
// //   });

// await db.query.awards
//   .findMany({
//     orderBy: (t, { desc }) => [desc(t.year)],
//     columns: {
//       year: true,
//     },
//     with: {
//       categories: {
//         columns: {
//           winner: true,
//         },
//         with: {
//           category: true,
//           nominees: {
//             columns: {
//               influencer: false,
//               ranking: true,
//             },
//             where: (t, { isNotNull }) => isNotNull(t.ranking),
//             orderBy: (t, { asc }) => [asc(t.ranking)],
//             with: {
//               influencer: true,
//             },
//           },
//         },
//       },
//     },
//   })
//   .then((entries) => {
//     writeFileSync(
//       `src/backup/hall-of-fame.json`,
//       JSON.stringify(entries, null, 2),
//     );
//   });

// // await db.query.creatorChallenges
// //   .findMany({
// //     columns: {
// //       organizer: false,
// //       location: false,
// //     },
// //     with: {
// //       location: true,
// //       organizer: true,
// //     },
// //   })
// //   .then((entries) => {
// //     storeEntries(entries, "creator-challenges");
// //   });

// // await db.query.conventions
// //   .findMany({
// //     with: {
// //       partners: true,
// //       location: true,
// //     },
// //   })
// //   .then((entries) => {
// //     storeEntries(entries, "conventions");
// //   });

// // await db.query.awards
// //   .findMany({
// //     with: {
// //       partners: {
// //         with: {
// //           brand: true,
// //         },
// //       },
// //       jury: {
// //         with: {
// //           expert: true,
// //         },
// //       },
// //       categories: {
// //         with: {
// //           category: true,
// //           nominees: {
// //             with: {
// //               influencer: true,
// //             },
// //           },
// //           sponsor: true,
// //         },
// //       },
// //       show: true,
// //     },
// //   })
// //   .then((entries) => {
// //     storeEntries(entries, "awards");
// //   });

// console.log("Migration completed!");

// // MARK: Migrations

// async function storeImages() {
//   const entries = await db.query.images.findMany();
//   storeEntries(
//     entries.map(({ src, ...rest }) => ({
//       src: getImageUrl(src),
//       ...rest,
//     })),
//     "images",
//   );
// }

// async function storeVideos() {
//   const entries = await db.query.images.findMany();
//   storeEntries(entries, "videos");
// }

// async function storeInfluencers() {
//   const entries = await db.query.influencers.findMany();
//   storeEntries(
//     entries.map(({ id, name, image, socials }) => ({
//       id,
//       name,
//       image: getImageUrl(image.src),
//       socials: socials as SocialMedia[],
//     })),
//     "influencers",
//   );
// }

// async function storeExperts() {
//   const entries = await db.query.experts.findMany();

//   storeEntries(
//     entries.map(({ id, name, image, socials, description }) => ({
//       id,
//       name,
//       image: getImageUrl(image.src),
//       socials: socials as SocialMedia[],
//       description: description,
//     })),
//     "experts",
//   );
// }

// async function storeBrands() {
//   const entries = await db.query.brands.findMany();

//   storeEntries(
//     entries.map(({ id, name, image, website }) => ({
//       id,
//       name,
//       logo: getImageUrl(image.src),
//       website,
//     })),
//     "brands",
//   );
// }

// async function storeLocations() {
//   const entries = await db.query.locations.findMany();

//   storeEntries(
//     entries.map(({ id, title, city, maps }) => ({
//       id,
//       name: title,
//       city,
//       url: maps,
//     })),
//     "locations",
//   );
// }

// async function storeCategories() {
//   const entries = await db.query.categories.findMany();

//   storeEntries(
//     entries.map(({ id, title, image }) => ({
//       id,
//       name: title,
//       image: getImageUrl(image.src),
//     })),
//     "categories",
//   );
// }

// async function storeCertifiedInfluencers() {
//   const entries = await db.query.certifiedInfluencers.findMany({
//     with: {
//       influencer: {
//         columns: {
//           id: true,
//           name: true,
//         },
//         with: {
//           interests: {
//             columns: {
//               category: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   storeEntries(
//     entries.map(
//       ({
//         id,
//         influencer,
//         image,
//         birthdate,
//         languages,
//         residence,
//         bio,
//         otherInterests,
//       }) => ({
//         id,
//         influencer: influencer.id,
//         image: getImageUrl(image.src),
//         birthdate,
//         languages: languages as Language[],
//         residence: residence as Canton,
//         bio: bio,
//         interests: otherInterests,
//         categories: influencer.interests.map(({ category }) => category),
//       }),
//     ),
//     "certified-influencers",
//   );
// }

// async function storeSocialMediaCampaigns() {
//   const entries = await db.query.socialMediaCampaigns.findMany({});

//   storeEntries(
//     entries.map(
//       ({
//         id,
//         image,
//         organizer,
//         title,
//         content,
//         start,
//         end,
//         location,
//         registration,
//       }) => ({
//         id,
//         image: getImageUrl(image.src),
//         organizer,
//         title,
//         content: content,
//         dateFrom: start,
//         dateTo: end,
//         location,
//         registrationUrl: registration,
//       }),
//     ),
//     "social-media-campaigns",
//   );
// }

// async function storeNetworkEvents() {
//   const entries = await db.query.networkEvents.findMany({});

//   storeEntries(
//     entries.map(
//       ({
//         id,
//         image,
//         title,
//         start,
//         end,
//         location,
//         description,
//         logo,
//         tickets,
//       }) => ({
//         id,
//         image: getImageUrl(image.src),
//         title,
//         dateFrom: start,
//         dateTo: end,
//         location,
//         description,
//         logo: getImageUrl(logo.src),
//         registrationUrl: tickets,
//       }),
//     ),
//     "network-events",
//   );
// }

// async function storeAgencies() {
//   const entries = await db.query.agencies.findMany({});

//   storeEntries(
//     entries.map(({ id, name, image, description, logo, email, website }) => ({
//       id,
//       name,
//       image: getImageUrl(image.src),
//       description,
//       logo: getImageUrl(logo.src),
//       email,
//       website,
//     })),
//     "agencies",
//   );
// }

// async function storeCreatorChallenges() {
//   const entries = await db.query.creatorChallenges.findMany({});

//   storeEntries(
//     entries.map(
//       ({
//         id,
//         image,
//         organizer,
//         title,
//         content,
//         start,
//         end,
//         location,
//         registration,
//       }) => ({
//         id,
//         image: getImageUrl(image.src),
//         organizer,
//         title,
//         content: content,
//         dateFrom: start,
//         dateTo: end,
//         location,
//         registrationUrl: registration,
//       }),
//     ),
//     "creator-challenges",
//   );
// }

// async function storeConversations() {
//   const entries = await db.query.conventions.findMany({
//     with: {
//       partners: true,
//     },
//   });

//   storeEntries(
//     entries.map(
//       ({
//         id,
//         title,
//         tickets,
//         date,
//         location,
//         schedule,
//         partners,
//         ...rest
//       }) => ({
//         id,
//         title,
//         date,
//         location,
//         partners: partners.map(({ brand }) => brand),
//         registrationUrl: tickets,
//         schedule,
//       }),
//     ),
//     "conventions",
//   );
// }

// async function storeAwards() {
//   const entries = await db.query.awards.findMany({
//     with: {
//       jury: true,
//       partners: true,
//       categories: {
//         with: {
//           category: true,
//           nominees: true,
//         },
//       },
//     },
//   });

//   storeEntries(
//     entries.map(
//       ({
//         id,
//         year,
//         newcomerScoutDeadline,
//         newcomerScoutUrl,
//         nominationDeadline,
//         nominationUrl,
//         votingDeadline,
//         jury,
//         partners,
//         categories,
//       }) => ({
//         id,
//         year,
//         newcomerScoutDeadline,
//         newcomerScoutUrl,
//         nominationDeadline,
//         nominationUrl,
//         votingDeadline,
//         jury: jury.map(({ expert }) => expert),
//         partners: partners.map(({ brand }) => brand),
//         categories: categories.map(({ category }) => category),
//       }),
//     ),
//     "awards",
//   );
// }

// async function storeAwardShows() {
//   const entries = await db.query.awardShows.findMany({
//     with: {
//       award: true,
//     },
//   });

//   storeEntries(
//     entries.map(
//       ({
//         id,
//         award,
//         tickets,
//         date,
//         location,
//         schedule,
//         video,
//         impressions,
//       }) => ({
//         id,
//         award: award.id,
//         tickets,
//         date,
//         location,
//         schedule,
//         video,
//         impressions: impressions?.map(({ src }) => src),
//       }),
//     ),
//     "award-shows",
//   );
// }

// // MARK: Migrations

// async function migrateInfluencers() {
//   const entries = await db.query.influencers.findMany();

//   for (const {
//     id,
//     name,
//     image: { src: imageSrc },
//     socials,
//   } of entries) {
//     try {
//       console.log(`Migrating: ${name}`);

//       const imageFile = await fetchLegacyImage(imageSrc, name);

//       const image = await payload.create({
//         collection: "profile-pictures",
//         data: {},
//         file: imageFile,
//       });

//       console.log(`Successfully uploaded image for ${name}`);

//       await payload.create({
//         collection: "influencers",
//         data: {
//           id,
//           name,
//           image: image.id,
//           socials: socials as SocialMedia[],
//         },
//       });

//       console.log(`Successfully migrated: ${name} (ID: ${id})`);
//     } catch (error) {
//       console.error(`Failed to migrate ${name}:`, error);
//     }
//   }
// }

// async function migrateExperts() {
//   const entries = await db.query.experts.findMany();

//   for (const {
//     id,
//     name,
//     description,
//     image: { src: imageSrc },
//     socials,
//   } of entries) {
//     try {
//       console.log(`Migrating: ${name}`);

//       const imageFile = await fetchLegacyImage(imageSrc, name);

//       const image = await payload.create({
//         collection: "profile-pictures",
//         data: {},
//         file: imageFile,
//       });

//       console.log(`Successfully uploaded image for ${name}`);

//       await payload.create({
//         collection: "experts",
//         data: {
//           id,
//           name,
//           image: image.id,
//           description: "",
//           socials: socials as SocialMedia[],
//         },
//       });

//       for (const [locale, value] of Object.entries(description)) {
//         await payload.update({
//           collection: "experts",
//           id,
//           locale: locale as SupportedLocale,
//           data: {
//             description: value,
//           },
//         });
//       }

//       console.log(`Successfully migrated: ${name} (ID: ${id})`);
//     } catch (error) {
//       console.error(`Failed to migrate ${name}:`, error);
//     }
//   }
// }

// async function migrateBrands() {
//   const entries = await db.query.brands.findMany();

//   for (const {
//     id,
//     name,
//     image: { src: imageSrc },
//     website,
//   } of entries) {
//     try {
//       console.log(`Migrating: ${name}`);

//       const imageFile = await fetchLegacyImage(imageSrc, name);

//       const image = await payload.create({
//         collection: "logos",
//         data: {},
//         file: imageFile,
//       });

//       console.log(`Successfully uploaded image for ${name}`);

//       await payload.create({
//         collection: "brands",
//         data: {
//           id,
//           name,
//           logo: image.id,
//           website,
//         },
//       });

//       console.log(`Successfully migrated: ${name} (ID: ${id})`);
//     } catch (error) {
//       console.error(`Failed to migrate ${name}:`, error);
//     }
//   }
// }

// async function migrateLocations() {
//   const entries = await db.query.locations.findMany();

//   for (const { id, title, city, maps } of entries) {
//     try {
//       console.log(`Migrating: ${title}`);

//       await payload.create({
//         collection: "locations",
//         data: {
//           id,
//           name: title,
//           city,
//           url: maps,
//         },
//       });

//       console.log(`Successfully migrated: ${title} (ID: ${id})`);
//     } catch (error) {
//       console.error(`Failed to migrate ${title}:`, error);
//     }
//   }
// }

// async function migrateCategories() {
//   const entries = await db.query.categories.findMany();

//   for (const {
//     id,
//     title,
//     image: { src: imageSrc },
//   } of entries) {
//     try {
//       console.log(`Migrating: ${title.en}`);

//       const imageFile = await fetchLegacyImage(imageSrc, title.en);

//       const image = await payload.create({
//         collection: "photos",
//         data: {},
//         file: imageFile,
//       });

//       console.log(`Successfully uploaded image for ${title.en}`);

//       await payload.create({
//         collection: "categories",
//         data: {
//           id,
//           name: title.en,
//           image: image.id,
//         },
//       });

//       for (const [locale, value] of Object.entries(title)) {
//         await payload.update({
//           collection: "categories",
//           id,
//           locale: locale as SupportedLocale,
//           data: {
//             name: value,
//           },
//         });
//       }

//       console.log(`Successfully migrated: ${title.en} (ID: ${id})`);
//     } catch (error) {
//       console.error(`Failed to migrate ${title.en}:`, error);
//     }
//   }
// }

// async function migrateCertifiedInfluencers() {
//   const entries = await db.query.certifiedInfluencers.findMany({
//     with: {
//       influencer: {
//         columns: {
//           id: true,
//           name: true,
//         },
//         with: {
//           interests: {
//             columns: {
//               category: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   for (const {
//     id,
//     influencer,
//     image: { src: imageSrc },
//     birthdate,
//     languages,
//     residence,
//     bio,
//     otherInterests,
//   } of entries) {
//     try {
//       console.log(`Migrating: ${influencer.name}`);

//       const imageFile = await fetchLegacyImage(imageSrc, influencer.name);

//       const image = await payload.create({
//         collection: "photos",
//         data: {},
//         file: imageFile,
//       });

//       console.log(`Successfully uploaded image for ${influencer.name}`);

//       await payload.create({
//         collection: "certified-influencers",
//         data: {
//           id,
//           influencer: influencer.id,
//           image: image.id,
//           birthdate,
//           languages: languages as Language[],
//           residence: residence as Canton,
//           bio: "",
//           categories: influencer.interests.map(({ category }) => category),
//         },
//       });

//       for (const locale of routing.locales) {
//         await payload.update({
//           collection: "certified-influencers",
//           id,
//           locale,
//           data: {
//             bio: bio[locale],
//             interests: otherInterests?.[locale],
//           },
//         });
//       }

//       console.log(`Successfully migrated: ${influencer.name} (ID: ${id})`);
//     } catch (error) {
//       console.error(`Failed to migrate ${influencer.name}:`, error);
//     }
//   }
// }

// async function migrateSocialMediaCampaigns() {
//   const entries = await db.query.socialMediaCampaigns.findMany({});

//   for (const {
//     id,
//     image: { src: imageSrc },
//     organizer,
//     title,
//     content,
//     start,
//     end,
//     location,
//     registration,
//   } of entries) {
//     try {
//       console.log(`Migrating: ${title.en}`);

//       const imageFile = await fetchLegacyImage(imageSrc, title.en);

//       const image = await payload.create({
//         collection: "photos",
//         data: {},
//         file: imageFile,
//       });

//       console.log(`Successfully uploaded image for ${title.en}`);

//       await payload.create({
//         collection: "social-media-campaigns",
//         data: {
//           id,
//           image: image.id,
//           organizer,
//           title: "",
//           content: {
//             root: {
//               type: "doc",
//               children: [],
//               direction: "ltr",
//               format: "",
//               indent: 0,
//               version: 1,
//             },
//           },
//           dateFrom: start,
//           dateTo: end,
//           location,
//           registrationUrl: registration,
//         },
//       });

//       for (const locale of routing.locales) {
//         await payload.update({
//           collection: "social-media-campaigns",
//           id,
//           locale,
//           data: {
//             title: title[locale],
//             content: HTMLToRichText(content[locale]),
//           },
//         });
//       }

//       console.log(`Successfully migrated: ${title.en} (ID: ${id})`);
//     } catch (error) {
//       console.error(`Failed to migrate ${title.en}:`, error);
//     }
//   }
// }

// async function migrateNetworkEvents() {
//   const entries = await db.query.networkEvents.findMany({});

//   for (const {
//     id,
//     image: { src: imageSrc },
//     title,
//     start,
//     end,
//     location,
//     description,
//     logo: { src: logoSrc },
//     tickets,
//   } of entries) {
//     try {
//       console.log(`Migrating: ${title.en}`);

//       const imageFile = await fetchLegacyImage(imageSrc, title.en);

//       const image = await payload.create({
//         collection: "photos",
//         data: {},
//         file: imageFile,
//       });

//       console.log(`Successfully uploaded image for ${title.en}`);

//       const logoFile = await fetchLegacyImage(logoSrc, title.en);

//       const logo = await payload.create({
//         collection: "logos",
//         data: {},
//         file: logoFile,
//       });

//       console.log(`Successfully uploaded logo for ${title.en}`);

//       await payload.create({
//         collection: "network-events",
//         data: {
//           id,
//           image: image.id,
//           logo: logo.id,
//           title: "",
//           content: {
//             root: {
//               type: "doc",
//               children: [],
//               direction: "ltr",
//               format: "",
//               indent: 0,
//               version: 1,
//             },
//           },
//           dateFrom: start,
//           dateTo: end,
//           location,
//           registrationUrl: tickets,
//         },
//       });

//       for (const locale of routing.locales) {
//         await payload.update({
//           collection: "network-events",
//           id,
//           locale,
//           data: {
//             title: title[locale],
//             content: HTMLToRichText(description[locale]),
//           },
//         });
//       }

//       console.log(`Successfully migrated: ${title.en} (ID: ${id})`);
//     } catch (error) {
//       console.error(`Failed to migrate ${title.en}:`, error);
//     }
//   }
// }

// async function migrateAgencies() {
//   const entries = await db.query.agencies.findMany({});

//   for (const {
//     id,
//     name,
//     image: { src: imageSrc },
//     description,
//     logo: { src: logoSrc },
//     email,
//     website,
//   } of entries) {
//     try {
//       console.log(`Migrating: ${name}`);

//       const imageFile = await fetchLegacyImage(imageSrc, name);

//       const image = await payload.create({
//         collection: "photos",
//         data: {},
//         file: imageFile,
//       });

//       console.log(`Successfully uploaded image for ${name}`);

//       const logoFile = await fetchLegacyImage(logoSrc, name);

//       const logo = await payload.create({
//         collection: "logos",
//         data: {},
//         file: logoFile,
//       });

//       console.log(`Successfully uploaded logo for ${name}`);

//       await payload.create({
//         collection: "agencies",
//         data: {
//           id,
//           image: image.id,
//           logo: logo.id,
//           name,
//           website,
//           email,
//           description: "",
//         },
//       });

//       for (const locale of routing.locales) {
//         await payload.update({
//           collection: "agencies",
//           id,
//           locale,
//           data: {
//             description: description[locale],
//           },
//         });
//       }

//       console.log(`Successfully migrated: ${name} (ID: ${id})`);
//     } catch (error) {
//       console.error(`Failed to migrate ${name}:`, error);
//     }
//   }
// }

// async function migrateCreatorChallenges() {
//   const entries = await db.query.creatorChallenges.findMany({});

//   for (const {
//     id,
//     image: { src: imageSrc },
//     organizer,
//     title,
//     content,
//     start,
//     end,
//     location,
//     registration,
//   } of entries) {
//     try {
//       console.log(`Migrating: ${title.en}`);

//       const imageFile = await fetchLegacyImage(imageSrc, title.en);

//       const image = await payload.create({
//         collection: "photos",
//         data: {},
//         file: imageFile,
//       });

//       console.log(`Successfully uploaded image for ${title.en}`);

//       await payload.create({
//         collection: "creator-challenges",
//         data: {
//           id,
//           image: image.id,
//           organizer,
//           title: "",
//           content: {
//             root: {
//               type: "doc",
//               children: [],
//               direction: "ltr",
//               format: "",
//               indent: 0,
//               version: 1,
//             },
//           },
//           dateFrom: start,
//           dateTo: end,
//           location,
//           registrationUrl: registration,
//         },
//       });

//       for (const locale of routing.locales) {
//         await payload.update({
//           collection: "creator-challenges",
//           id,
//           locale,
//           data: {
//             title: title[locale],
//             content: HTMLToRichText(content[locale]),
//           },
//         });
//       }

//       console.log(`Successfully migrated: ${title.en} (ID: ${id})`);
//     } catch (error) {
//       console.error(`Failed to migrate ${title.en}:`, error);
//     }
//   }
// }

// async function migrateConversations() {
//   const entries = await db.query.conventions.findMany({
//     with: {
//       partners: true,
//     },
//   });

//   for (const {
//     id,
//     title,
//     tickets,
//     date,
//     location,
//     schedule,
//     partners,
//   } of entries) {
//     try {
//       console.log(`Migrating: ${title}`);

//       await payload.create({
//         collection: "conventions",
//         data: {
//           id,
//           title,
//           date,
//           location,
//           partners: partners.map(({ brand }) => brand),
//           // TODO update description manually
//           schedule: schedule.map(
//             ({ title, start, end, room, description }) => ({
//               title: title.en,
//               from: start.toISOString(),
//               to: end.toISOString(),
//               room,
//               description: {
//                 root: {
//                   type: "doc",
//                   children: [],
//                   direction: "ltr",
//                   format: "",
//                   indent: 0,
//                   version: 1,
//                 },
//               },
//             }),
//           ),
//           registrationUrl: tickets,
//         },
//       });

//       console.log(`Successfully migrated: ${title} (ID: ${id})`);
//     } catch (error) {
//       console.error(`Failed to migrate ${title}:`, error);
//     }
//   }
// }

// async function migrateAwards() {
//   const entries = await db.query.awards.findMany({
//     with: {
//       jury: true,
//       partners: true,
//       categories: {
//         with: {
//           category: true,
//           nominees: true,
//         },
//       },
//     },
//   });

//   for (const {
//     id,
//     year,
//     newcomerScoutDeadline,
//     newcomerScoutUrl,
//     nominationDeadline,
//     nominationUrl,
//     votingDeadline,
//     jury,
//     partners,
//     categories,
//   } of entries) {
//     try {
//       console.log(`Migrating: ${year}`);

//       await payload.create({
//         collection: "awards",
//         data: {
//           id,
//           year,
//           categories: await (async () => {
//             if (categories.length === 0) return undefined;

//             const results = new Array<
//               NonNullable<Award["categories"]>[number]
//             >();

//             for (const { category, sponsor, nominees, winner } of categories) {
//               if (!winner) {
//                 results.push({
//                   category: category.id,
//                   sponsor,
//                   nominees: nominees.map(({ influencer }) => ({ influencer })),
//                 });
//                 continue;
//               }

//               const winnerImageFile = await fetchLegacyImage(
//                 winner.src,
//                 `winner-${category.title.en}-${year}`,
//               );

//               const winnerImage = await payload.create({
//                 collection: "profile-pictures",
//                 data: {},
//                 file: winnerImageFile,
//               });

//               results.push({
//                 category: category.id,
//                 sponsor,
//                 nominees: nominees.map(({ influencer }) => ({ influencer })),
//                 winnerImage: winnerImage.id,
//               });
//             }
//             return results;
//           })(),
//           jury: jury.map(({ expert }) => ({ expert })),
//           partners: partners.map(({ brand }) => ({ brand })),
//           newcomerScoutDeadline,
//           newcomerScoutUrl,
//           nominationDeadline,
//           nominationUrl,
//           votingDeadline,
//         },
//       });

//       console.log(`Successfully migrated: ${year} (ID: ${id})`);
//     } catch (error) {
//       console.error(`Failed to migrate ${year}:`, error);
//     }
//   }
// }

// async function migrateAwardShows() {
//   const entries = await db.query.awardShows.findMany({
//     with: {
//       award: true,
//     },
//   });

//   for (const {
//     id,
//     award,
//     tickets,
//     date,
//     location,
//     schedule,
//     video,
//     impressions,
//   } of entries) {
//     try {
//       console.log(`Migrating: ${award.year}`);

//       const images = new Array<number>();
//       let index = 0;

//       for (const { src } of impressions ?? []) {
//         const imageFile = await fetchLegacyImage(
//           src,
//           `impression-${award.year}-${index}`,
//         );
//         const image = await payload.create({
//           collection: "photos",
//           data: {},
//           file: imageFile,
//         });

//         images.push(image.id);
//         index++;
//       }

//       await payload.create({
//         collection: "award-shows",
//         data: {
//           id,
//           award: award.id,
//           date,
//           location,
//           // TODO update description manually
//           schedule: schedule.map(({ title, start, end, description }) => ({
//             title: title.en,
//             from: start?.toISOString(),
//             to: end?.toISOString(),
//             description: {
//               root: {
//                 type: "doc",
//                 children: [],
//                 direction: "ltr",
//                 format: "",
//                 indent: 0,
//                 version: 1,
//               },
//             },
//           })),
//           registrationUrl: tickets,
//           videoUrl: video,
//           images: images.length > 0 ? images : undefined,
//         },
//       });

//       console.log(`Successfully migrated: ${award.year} (ID: ${id})`);
//     } catch (error) {
//       console.error(`Failed to migrate ${award.year}:`, error);
//     }
//   }
// }

// // MARK: Utilities

// function getImageUrl(src: string) {
//   return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${src}`;
// }

// async function fetchLegacyImage(url: string, filename: string): Promise<File> {
//   const imageResponse = await fetch(url);

//   if (!imageResponse.ok) {
//     throw new Error(`Failed to fetch image: ${imageResponse.status}`);
//   }

//   const imageBuffer = await imageResponse.arrayBuffer();
//   const contentType = imageResponse.headers.get("content-type") ?? "image/jpeg";

//   const imageExtension = path.extname(new URL(url).pathname) || ".jpg";

//   return {
//     data: Buffer.from(imageBuffer),
//     mimetype: contentType,
//     name: `${slugify(filename, { lower: true })}${imageExtension}`,
//     size: imageBuffer.byteLength,
//   };
// }

// // TODO implement this
// function HTMLToRichText(html: string): DefaultTypedEditorState {
//   return null;
// }

// function storeEntries<T>(entries: unknown[], collection: string) {
//   writeFileSync(
//     `src/backup/${collection}.json`,
//     JSON.stringify(entries, null, 2),
//   );
// }

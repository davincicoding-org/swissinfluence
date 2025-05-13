import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://swissinfluence.ch/",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      alternates: {
        languages: {
          en: "https://swissinfluence.ch/de",
          de: "https://swissinfluence.ch/en",
          fr: "https://swissinfluence.ch/fr",
          it: "https://swissinfluence.ch/it",
        },
      },
    },
    {
      url: "https://swissinfluence.ch/en/award",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
      alternates: {
        languages: {
          en: "https://swissinfluence.ch/de/award",
          de: "https://swissinfluence.ch/en/award",
          fr: "https://swissinfluence.ch/fr/award",
          it: "https://swissinfluence.ch/it/award",
        },
      },
    },
    {
      url: "https://swissinfluence.ch/en/network",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
      alternates: {
        languages: {
          en: "https://swissinfluence.ch/de/network",
          de: "https://swissinfluence.ch/en/network",
          fr: "https://swissinfluence.ch/fr/network",
          it: "https://swissinfluence.ch/it/network",
        },
      },
    },
    {
      url: "https://swissinfluence.ch/en/convention",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
      alternates: {
        languages: {
          en: "https://swissinfluence.ch/de/convention",
          de: "https://swissinfluence.ch/en/convention",
          fr: "https://swissinfluence.ch/fr/convention",
          it: "https://swissinfluence.ch/it/convention",
        },
      },
    },
    {
      url: "https://swissinfluence.ch/en/academy",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
      alternates: {
        languages: {
          en: "https://swissinfluence.ch/de/academy",
          de: "https://swissinfluence.ch/en/academy",
          fr: "https://swissinfluence.ch/fr/academy",
          it: "https://swissinfluence.ch/it/academy",
        },
      },
    },
  ];
}

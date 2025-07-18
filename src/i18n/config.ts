import type { MessagesSchema } from "payload-polyglot";
import { z } from "zod/v4";

export const Locale = z.enum(["en", "de", "fr", "it"]);
export type SupportedLocale = z.infer<typeof Locale>;

export const MESSAGES_SCHEMA = {
  navigation: {
    main: {
      academy: "short",
      award: "short",
      network: {
        page: "short",
        influencers: "short",
        events: "short",
        campaigns: "short",
        agencies: "short",
      },
      convention: "short",
    },
    sub: {
      contact: "short",
      "nomination-process": "short",
      imprint: "short",
      sponsoring: "short",
      privacy: "short",
    },
  },
  landing: {
    meta: {
      title: "short",
      description: "long",
    },
    headline: ["long", "<Flip>...</Flip>", "<Static>...</Static>"],
    links: {
      network: "short",
      award: "short",
      academy: "short",
      forum: "short",
    },
  },
  award: {
    hero: {
      default: {
        title: "short",
        CTA: "short",
      },
      announced: { headline: "short" },
      nomination: { CTA: "short", headline: "short" },
      "nomination-ended": { headline: "short", CTA: "short" },
      voting: { headline: "short", CTA: "short" },
      "voting-ended": { headline: "short" },
      "pre-show": { CTA: "short" },
      "during-show": { headline: "short" },
      "show-countdown": { CTA: "short" },
      "post-show": { headline: "short" },
      awarded: { headline: "short", CTA: "short" },
      finished: { headline: "short", CTA: "short" },
    },
    voting: {
      title: "short",
      description: "rich",
      CTA: "short",
    },
    nomination: {
      title: "short",
      description: "rich",
      CTA: "short",
    },
    "newcomer-scout": {
      CTA: "short",
    },
    "creator-challenges": {
      title: "short",
      description: "rich",
    },
    show: {
      "buy-cta": "short",
      "slot-from": ["short", "{time}"],
      "slot-until": ["short", "{time}"],
      "sold-out": "short",
      "date-tbd": "short",
      "sale-not-open": "short",
    },
  },
  network: {
    page: {
      hero: {
        title: "short",
        headline: "long",
      },
      links: {
        influencers: "short",
        campaigns: "short",
        events: "short",
        agencies: "short",
        whatsapp: "short",
      },
    },
    influencers: {
      title: "short",
      certification: {
        title: "short",
      },
      discovery: {
        title: "short",
        description: "rich",
      },
    },
    campaigns: {
      title: "short",
      request: {
        title: "short",
        CTA: "short",
      },
    },
    events: {
      title: "short",
      headline: "long",
    },
    agencies: {
      title: "short",
      headline: "long",
      "list-title": "short",
      "contact-CTA": "short",
    },
  },
  convention: {
    hero: {
      title: "short",
      headline: "long",
      CTA: "short",
    },
    content: "rich",
  },
  academy: {
    hero: {
      title: "short",
      headline: "long",
      CTA: "short",
    },
  },
  newsletter: {
    description: "long",
    CTA: "short",
  },
} satisfies MessagesSchema;

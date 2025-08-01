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
    aria: {
      langSwitch: "short",
      // TODO not used anymore
      navigateTo: ["short", "{target}"],
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
      nomination: { headline: "short", CTA: "short" },
      "nomination-ended": { headline: "short", CTA: "short" },
      "voting-countdown": { headline: "short" },
      voting: { headline: "short", CTA: "short" },
      "between-votings": { headline: "short" },
      "voting-ended": { headline: "short" },
      "pre-show": { CTA: "short" },
      "during-show": { headline: "short" },
      "show-countdown": { CTA: "short" },
      "post-show": { headline: "short" },
      awarded: { headline: "short", CTA: "short" },
      finished: { headline: "short", CTA: "short" },
    },
    show: {
      title: "short",
      linkLabel: "short",
    },
    nomination: {
      title: "short",
      linkLabel: "short",
      description: "rich",
      CTA: "short",
    },
    "newcomer-scout": {
      linkLabel: "short",
      CTA: "short",
      info: "short",
      perks: "short",
      timeline: "short",
    },
    "creator-challenges": {
      title: "short",
      linkLabel: "short",
      description: "rich",
      labels: {
        current: "short",
        past: "short",
      },
    },
    categories: {
      title: "short",
      linkLabel: "short",
      sponsoredBy: ["short", "{brand}"],
      "view-nominees": "short",
    },
    jury: {
      title: "short",
      linkLabel: "short",
    },
    impressions: {
      current: {
        title: "short",
        linkLabel: "short",
      },
      past: {
        title: ["short", "{year}"],
        linkLabel: "short",
      },
      afterMovie: "short",
    },
    hallOfFame: {
      title: "short",
      linkLabel: "short",
      ranking: {
        first: "short",
        second: "short",
        third: "short",
        other: ["short", "{rank}"],
      },
      aria: {
        next: "short",
        previous: "short",
      },
    },
  },
  voting: {
    CTA: "short",
    selection: {
      instructions: "long",
      submit: "short",
      reset: "short",
      intro: {
        title: "short",
        message: "rich",
        CTA: "short",
      },
    },
    form: {
      title: "short",
      placeholders: {
        firstName: "short",
        lastName: "short",
        email: "short",
      },
      subaddressWarning: "long",
      disclaimer: "short",
      newsletter: "short",
      submit: "short",
      cancel: "short",
      validation: {
        tooShort: ["short", "{min}"],
        tooLong: ["short", "{max}"],
        emailInvalid: "short",
      },
    },
    submission: {
      title: "short",
      message: "long",
      close: "short",
    },
    confirmation: {
      title: "short",
      message: "long",
      close: "short",
    },
  },
  network: {
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
    profile: {
      age: "short",
      "based-in": "short",
      speaks: "short",
      "cooperation-interests": "short",
      "other-interests": "short",
    },
  },
  campaigns: {
    title: "short",
    headline: "short",
    request: {
      title: "short",
      message: "short",
      CTA: "short",
    },
    labels: {
      current: "short",
      past: "short",
    },
  },
  agencies: {
    title: "short",
    headline: "long",
    "list-title": "short",
    "contact-CTA": "short",
  },
  events: {
    titles: {
      awardShow: "short",
      convention: "short",
    },
    page: { title: "short", headline: "long" },
    event: {
      "register-cta": "short",
      "slot-from": ["short", "{time}"],
      "slot-until": ["short", "{time}"],
      "sold-out": "short",
      "date-tbd": "short",
      "sale-not-open": "short",
    },
  },
  convention: {
    hero: {
      title: "short",
      headline: "long",
      CTA: "short",
    },
    title: "short",
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
    title: "short",
    placeholders: {
      firstName: "short",
      lastName: "short",
      email: "short",
    },
    submit: "short",
  },
  misc: {
    "close-modal": "short",
    "social-link": ["short", "{platform}"],
    "more-social-links": "short",
    "time-left": ["short", "{timeLeft}"],
  },
} satisfies MessagesSchema;

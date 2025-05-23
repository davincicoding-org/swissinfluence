import { z } from "zod/v4";

import { SocialMediaSchema } from "./common/socials";

export const GLOBALS = {
  company: z.object({
    name: z.string().default("dercampus"),
    address: z.string(),
    whatsapp: z.string(),
    socials: z.array(
      z.object({
        platform: z.enum(SocialMediaSchema.shape.platform.options),
        url: z.string(),
      }),
    ),
  }),

  forms: z.object({
    newsletter: z.string(),
    influencerApplication: z.string(),
    agencyApplication: z.string(),
    cooperationRequest: z.string(),
    campaignRequest: z.string(),
    contact: z.string(),
  }),
};

export type GlobalId = keyof typeof GLOBALS;
export type GlobalData<T extends GlobalId> = z.infer<(typeof GLOBALS)[T]>;

import type { ArrayField } from "payload";

// TODO make platform unique in parent
export const SocialsField: ArrayField = {
  name: "socials",
  type: "array",
  interfaceName: "Socials",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "platform",
          type: "select",
          options: [
            "INSTAGRAM",
            "TIKTOK",
            "LINKEDIN",
            "YOUTUBE",
            "APPLE_PODCAST",
            "SPOTIFY",
            "TWITCH",
            "WEBSITE",
            "WHATSAPP",
          ],
          required: true,
          admin: {
            width: "200px",
          },
        },
        {
          name: "url",
          type: "text",
          required: true,
        },
      ],
    },
  ],
};

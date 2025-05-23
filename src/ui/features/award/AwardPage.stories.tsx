import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { useMemo } from "react";
import dayjs from "dayjs";

import { derivative } from "@/ui/utils";

import { AwardPage } from "./AwardPage";

// import {
//   AWARD_JURY,
//   AWARD_NOMINEES,
//   AWARD_PARTNERS,
//   AWARD_SHOW,
//   HALL_OF_FAME,
//   IMPRESSIONS,
// } from "./mock";

const meta = {
  component: AwardPage,
  args: {
    heroImage: {
      src: "https://firebasestorage.googleapis.com/v0/b/swissinfluence-86ce8.firebasestorage.app/o/media%2Faward%2Fmedia.images.hero.webp?alt=media&token=55556934-46ca-4a4c-b4a6-b087039fabff",
      blurDataURL:
        "data:image/png;base64,UklGRjQBAABXRUJQVlA4TCgBAAAvCYABAC/COAAAI5fNl13ftmnxdrBtrOE4AAAiyrZtN0C/Zm6bNvDZPsYBABi57Jfrr2EauGVs25z/CAEnDh4WoPX/O0yduSnfq/1IBAJIAP3inisEwygoSLpAiAC/bhGY/jWc/KHi7WBQFDTLTRTU4fZ/C1wI0dNGXHH/8XEOlhtHWPkL1hk7F8sONyIaIb+M4Z1QdjODsJ4jUcJrx07OgUB/UdebhzwkCsSg8QfC4mQcYHER+dcsL6BiNjCya44rpt8RFx0KwdKlMgIvanU1r4kZ4+7mlHw4cYvRPgLihfkeGDgIAIBsw7Nt2zZuRvQ/FNi6+c7pApBkj3PnrRfQFB//KemD5ZoJ99/AVe2+xdrzezBs+I4Q9fVpaL4oc1mvUxQnSAozAA==",
      width: 5090,
      height: 3393,
    },
    newcomerScoutImage: {
      src: "https://firebasestorage.googleapis.com/v0/b/swissinfluence-86ce8.firebasestorage.app/o/media%2Faward%2Fmedia.images.newcomerScout.webp?alt=media&token=9e8e2892-6900-4e49-84a9-038760a4cdce",
      blurDataURL:
        "data:image/png;base64,UklGRjQBAABXRUJQVlA4TCgBAAAvCYABAC/COAAAI5fNl13ftmnxdrBtrOE4AAAiyrZtN0C/Zm6bNvDZPsYBABi57Jfrr2EauGVs25z/CAEnDh4WoPX/O0yduSnfq/1IBAJIAP3inisEwygoSLpAiAC/bhGY/jWc/KHi7WBQFDTLTRTU4fZ/C1wI0dNGXHH/8XEOlhtHWPkL1hk7F8sONyIaIb+M4Z1QdjODsJ4jUcJrx07OgUB/UdebhzwkCsSg8QfC4mQcYHER+dcsL6BiNjCya44rpt8RFx0KwdKlMgIvanU1r4kZ4+7mlHw4cYvRPgLihfkeGDgIAIBsw7Nt2zZuRvQ/FNi6+c7pApBkj3PnrRfQFB//KemD5ZoJ99/AVe2+xdrzezBs+I4Q9fVpaL4oc1mvUxQnSAozAA==",
      width: 5090,
      height: 3393,
    },
    currentAward: null,
    pastImpressions: null,
    challenges: [],
    hallOfFame: [],
    // currentAward: {
    //   year: 2024,
    //   jury: AWARD_JURY,
    //   partners: AWARD_PARTNERS,
    // },
    // pastAward: {
    //   year: 2023,
    //   afterMovie: "https://www.youtube.com/watch?v=fIR0w5PbUnY",
    //   images: IMPRESSIONS,
    // },
    // hallOfFame: HALL_OF_FAME,
    // campaigns: [],
  },
  // argTypes: {
  //   // foo is the property we want to remove from the UI
  //   heroImage: {
  //     table: {
  //       disable: true,
  //     },
  //   },
  //   currentAward: {
  //     table: {
  //       disable: true,
  //     },
  //   },
  //   pastAward: {
  //     table: {
  //       disable: true,
  //     },
  //   },
  //   hallOfFame: {
  //     table: {
  //       disable: true,
  //     },
  //   },
  // },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AwardPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: StoryObj<
  ComponentProps<typeof AwardPage> & {
    nomination: "none" | "open" | "closed";
    nominees: boolean;
    voting: "none" | "open" | "closed";
    show: "none" | "upcoming" | "live" | "over";
    ranked: boolean;
    impressions: boolean;
  }
> = {
  args: {
    nomination: "none",
    voting: "none",
    nominees: false,
    show: "none",
    ranked: false,
    impressions: false,
  },
  argTypes: {
    nomination: {
      name: "Nomination",
      options: ["none", "open", "closed"],
      control: { type: "select" },
    },
    nominees: { name: "Nominees Added", control: { type: "boolean" } },
    voting: {
      name: "Voting",
      options: ["none", "open", "closed"],
      control: { type: "select" },
    },
    show: {
      name: "Show",
      options: ["none", "upcoming", "live", "over"],
      control: { type: "select" },
    },
    ranked: { name: "Winners Added", control: { type: "boolean" } },
    impressions: {
      name: "Impressions",
      control: { type: "boolean" },
    },
  },
  // render: ({
  //   // currentAward,
  //   // pastAward,
  //   heroImage,
  //   // newcomerScoutImage,
  //   // hallOfFame,
  //   // campaigns,
  //   // ...controls
  // }) => {
  //   // eslint-disable-next-line react-hooks/rules-of-hooks
  //   // const controlledCurrentAward = useMemo<ICurrentAward>(
  //   //   () => ({
  //   //     ...currentAward!,
  //   //     nomination: derivative<ICurrentAward["nomination"]>(() => {
  //   //       switch (controls.nomination) {
  //   //         case "none":
  //   //           return undefined;
  //   //         case "open":
  //   //           return {
  //   //             deadline: dayjs().add(7, "days").toISOString(),
  //   //             url: "#",
  //   //           };
  //   //         case "closed":
  //   //           return {
  //   //             deadline: dayjs().subtract(1, "day").toISOString(),
  //   //             url: "#",
  //   //           };
  //   //       }
  //   //     }),
  //   //     nominees: controls.nominees ? AWARD_NOMINEES : undefined,
  //   //     voting: derivative<ICurrentAward["voting"]>(() => {
  //   //       switch (controls.voting) {
  //   //         case "none":
  //   //           return undefined;
  //   //         case "open":
  //   //           return {
  //   //             deadline: dayjs().add(7, "days").toISOString(),
  //   //           };
  //   //         case "closed":
  //   //           return {
  //   //             deadline: dayjs().subtract(1, "day").toISOString(),
  //   //           };
  //   //       }
  //   //     }),
  //   //     show: derivative<ICurrentAward["show"]>(() => {
  //   //       switch (controls.show) {
  //   //         case "none":
  //   //           return undefined;
  //   //         case "upcoming":
  //   //           return {
  //   //             date: dayjs().add(10, "days").toISOString(),
  //   //             ...AWARD_SHOW,
  //   //           };
  //   //         case "live":
  //   //           return {
  //   //             date: dayjs().subtract(10, "minutes").toISOString(),
  //   //             ...AWARD_SHOW,
  //   //           };
  //   //         case "over":
  //   //           return {
  //   //             date: dayjs().subtract(1, "day").toISOString(),
  //   //             ...AWARD_SHOW,
  //   //           };
  //   //       }
  //   //     }),
  //   //     ranked: controls.ranked,
  //   //     impressions: controls.impressions
  //   //       ? {
  //   //           afterMovie: "https://www.youtube.com/watch?v=fIR0w5PbUnY",
  //   //           images: IMPRESSIONS,
  //   //         }
  //   //       : undefined,
  //   //   }),
  //   //   [currentAward, controls],
  //   // );

  //   return (
  //     <AwardPage
  //       heroImage={heroImage}
  //       newcomerScoutImage={newcomerScoutImage}
  //       currentAward={controlledCurrentAward}
  //       pastAward={pastAward}
  //       hallOfFame={hallOfFame}
  //       campaigns={campaigns}
  //     />
  //   );
  // },
};

// export const Initial: Story = {};

// export const Nomination: Story = {
//   args: {
//     currentAward: {
//       ...meta.args.currentAward,
//       nomination: {
//         deadline: dayjs().add(7, "days").toISOString(),
//         url: "#",
//       },
//     },
//   },
// };

// export const NominationEnded: Story = {
//   args: {
//     currentAward: {
//       ...meta.args.currentAward,
//       nomination: {
//         deadline: new Date("1992-05-27").toISOString(),
//         url: "#",
//       },
//     },
//   },
// };
// export const NomineesPublished: Story = {
//   args: {
//     currentAward: {
//       ...meta.args.currentAward,
//       nomination: {
//         deadline: new Date("1992-05-27").toISOString(),
//         url: "#",
//       },
//       nominees: AWARD_NOMINEES,
//     },
//   },
// };

// export const Voting: Story = {
//   args: {
//     currentAward: {
//       ...meta.args.currentAward,
//       nomination: {
//         deadline: new Date("1992-05-27").toISOString(),
//         url: "#",
//       },

//       voting: {
//         deadline: dayjs().add(7, "days").toISOString(),
//       },
//       nominees: AWARD_NOMINEES,
//     },
//   },
// };

// export const VotingEnded: Story = {
//   args: {
//     currentAward: {
//       ...meta.args.currentAward,
//       nomination: {
//         deadline: new Date("1992-05-27").toISOString(),
//         url: "#",
//       },
//       voting: {
//         deadline: new Date("1992-05-27").toISOString(),
//       },
//       nominees: AWARD_NOMINEES,
//     },
//   },
// };

// export const PreShow: Story = {
//   args: {
//     currentAward: {
//       ...meta.args.currentAward,
//       nomination: {
//         deadline: new Date("1992-05-27").toISOString(),
//         url: "#",
//       },
//       voting: {
//         deadline: new Date("1992-05-27").toISOString(),
//       },
//       nominees: AWARD_NOMINEES,
//       show: {
//         date: dayjs().add(10, "days").toISOString(),
//         ...AWARD_SHOW,
//       },
//     },
//   },
// };

// export const DuringShow: Story = {
//   args: {
//     currentAward: {
//       ...meta.args.currentAward,
//       nomination: {
//         deadline: new Date("1992-05-27").toISOString(),
//         url: "#",
//       },
//       voting: {
//         deadline: new Date("1992-05-27").toISOString(),
//       },
//       nominees: AWARD_NOMINEES,
//       show: {
//         date: dayjs().subtract(10, "minutes").toISOString(),
//         ...AWARD_SHOW,
//       },
//     },
//   },
// };

// export const PostShow: Story = {
//   args: {
//     currentAward: {
//       ...meta.args.currentAward,
//       nomination: {
//         deadline: new Date("1992-05-27").toISOString(),
//         url: "#",
//       },
//       voting: {
//         deadline: new Date("1992-05-27").toISOString(),
//       },
//       nominees: AWARD_NOMINEES,
//       show: {
//         date: dayjs().subtract(1, "day").toISOString(),
//         ...AWARD_SHOW,
//       },
//     },
//   },
// };

// export const WinnersPublished: Story = {
//   args: {
//     currentAward: {
//       ...meta.args.currentAward,
//       nomination: {
//         deadline: new Date("1992-05-27").toISOString(),
//         url: "#",
//       },
//       voting: {
//         deadline: new Date("1992-05-27").toISOString(),
//       },
//       nominees: AWARD_NOMINEES,
//       ranked: true,
//     },
//   },
// };

// export const ImpressionsPublished: Story = {
//   args: {
//     currentAward: {
//       ...meta.args.currentAward,
//       nomination: {
//         deadline: new Date("1992-05-27").toISOString(),
//         url: "#",
//       },
//       voting: {
//         deadline: new Date("1992-05-27").toISOString(),
//       },
//       nominees: AWARD_NOMINEES,
//       show: {
//         date: dayjs().subtract(1, "day").toISOString(),
//         ...AWARD_SHOW,
//       },
//       ranked: true,
//       impressions: {
//         afterMovie: "https://www.youtube.com/watch?v=fIR0w5PbUnY",
//         images: IMPRESSIONS,
//       },
//     },
//   },
// };

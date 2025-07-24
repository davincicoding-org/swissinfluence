import type { MantineTransition } from "@mantine/core";

export const scaleUp: MantineTransition = {
  in: { opacity: 1, transform: "scaleY(1)" },
  out: { opacity: 0, transform: "scaleY(0)" },
  common: { transformOrigin: "bottom" },
  transitionProperty: "transform, opacity",
};

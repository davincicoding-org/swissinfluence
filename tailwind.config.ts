import type { Config } from "tailwindcss";
import Typography from "@tailwindcss/typography";

export default {
  plugins: [Typography],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/cms/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
      },
      colors: {
        mocha: {
          "50": "rgb(248 245 242 / <alpha-value>)",
          "100": "rgb(234 226 219 / <alpha-value>)",
          "200": "rgb(212 195 179 / <alpha-value>)",
          "300": "rgb(189 163 140 / <alpha-value>)",
          "400": "rgb(174 138 113 / <alpha-value>)",
          "500": "rgb(164 120 100 / <alpha-value>)",
          "600": "rgb(141 95 82 / <alpha-value>)",
          "700": "rgb(119 76 70 / <alpha-value>)",
          "800": "rgb(99 63 61 / <alpha-value>)",
          "900": "rgb(82 54 53 / <alpha-value>)",
          "950": "rgb(45 27 27 / <alpha-value>)",
        },
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
} satisfies Config;

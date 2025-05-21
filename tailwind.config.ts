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
          "50": "#f8f5f2",
          "100": "#eae2db",
          "200": "#d4c3b3",
          "300": "#bda38c",
          "400": "#ae8a71",
          "500": "#a47864",
          "600": "#8d5f52",
          "700": "#774c46",
          "800": "#633f3d",
          "900": "#523635",
          "950": "#2d1b1b",
        },
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
} satisfies Config;

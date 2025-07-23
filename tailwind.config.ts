import type { Config } from "tailwindcss";
import Typography from "@tailwindcss/typography";

export default {
  plugins: [Typography],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
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
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 4s linear infinite",
      },
      backgroundImage: {
        "shiny-gold":
          "linear-gradient(90deg, #f59e0b 0%, #fbbf24 25%, #fcd34d 50%, #fbbf24 75%, #f59e0b 100%)",
        "shiny-silver":
          "linear-gradient(90deg, #6b7280 0%, #9ca3af 25%, #d1d5db 50%, #9ca3af 75%, #6b7280 100%)",
        "shiny-bronze":
          "linear-gradient(90deg, #92400e 0%, #d97706 25%, #f59e0b 50%, #d97706 75%, #92400e 100%)",
        "shiny-highlight":
          "linear-gradient(90deg, transparent 0%, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%, transparent 100%)",
      },
      backgroundSize: {
        shimmer: "200% 100%",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
} satisfies Config;

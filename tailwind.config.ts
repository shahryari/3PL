import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          "50": "#fffdea",
          "100": "#fff6c5",
          "200": "#ffed85",
          "300": "#ffde46",
          "400": "#ffcb1b",
          "500": "#f7a400",
          "600": "#e28000",
          "700": "#bb5902",
          "800": "#984408",
          "900": "#7c380b",
          "950": "#481c00",
        },
      },
      fontFamily: {
        sans: ["var(--font-yekan)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;

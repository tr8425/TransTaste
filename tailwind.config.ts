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
        coral: {
          DEFAULT: "#D85A30",
          light: "#E8764D",
          dark: "#B84A28",
        },
        cream: {
          DEFAULT: "#FDFAF5",
          dark: "#F8F6F2",
        },
        brown: {
          dark: "#2C1A0E",
          medium: "#8B6A50",
          light: "#C4A882",
        },
        amber: {
          brand: "#BA7517",
        },
        success: "#639922",
        danger: "#E24B4A",
      },
      fontFamily: {
        sans: [
          "Inter",
          "DM Sans",
          "Noto Sans KR",
          "Noto Sans JP",
          "Noto Sans SC",
          "sans-serif",
        ],
      },
      maxWidth: {
        mobile: "430px",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};
export default config;

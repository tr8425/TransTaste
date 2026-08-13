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
          DEFAULT: "#ff6b2c",
          light: "#ff8757",
          dark: "#dc4d12",
        },
        cream: {
          DEFAULT: "#f3efe7",
          dark: "#e9e3d9",
        },
        brown: {
          dark: "#171712",
          medium: "#655f55",
          light: "#9e978b",
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

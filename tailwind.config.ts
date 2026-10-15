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
        // Fonts are self-hosted via next/font in src/app/layout.tsx
        sans: [
          "var(--font-manrope)",
          "var(--font-noto-kr)",
          "var(--font-noto-jp)",
          "Noto Sans SC",
          "sans-serif",
        ],
        display: ["var(--font-archivo-black)", "Arial Black", "sans-serif"],
      },
      fontSize: {
        // Small UI roles below text-xs; line-height stays inherited
        micro: "10px",
        caption: "11px",
      },
      letterSpacing: {
        // Uppercase labels at 10-14px
        caps: "0.08em",
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

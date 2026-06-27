import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        navy: {
          deep: "#000D26",
          DEFAULT: "#001240",
          light: "#001A5C",
        },
        royal: {
          DEFAULT: "#0033A0",
          bright: "#0047CC",
          light: "#1A5FE0",
        },
        gold: {
          deep: "#B8860B",
          DEFAULT: "#D4AF37",
          light: "#F0C040",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(ellipse at top, #001A5C 0%, #000D26 70%)",
        "royal-gradient": "linear-gradient(135deg, #1A5FE0, #0047CC, #0033A0)",
        "gold-gradient": "linear-gradient(135deg, #F0C040, #D4AF37, #B8860B)",
      },
      boxShadow: {
        "gold-glow": "0 10px 40px -10px rgba(212, 175, 55, 0.35)",
        "royal-glow": "0 20px 60px -20px rgba(0, 71, 204, 0.45)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./game/**/*.{ts,tsx,html}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0d0a",
        foreground: "#f5f0e6",
        copper: {
          500: "#b87333",
          600: "#9c5d25"
        }
      },
      fontFamily: {
        display: ["'DM Serif Display'", "serif"],
        sans: ["'Inter'", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 20px rgba(184, 115, 51, 0.45)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;

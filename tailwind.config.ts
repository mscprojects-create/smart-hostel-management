import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Archivo Black"', "system-ui", "sans-serif"],
        sans: ['"Space Grotesk"', "system-ui", "sans-serif"],
        mono: ['"Space Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        paper: "#F3EEE1",
        panel: "#FBF8F0",
        ink: "#16130D",
        // Legacy alias kept so older utility classes resolve to the brand cobalt.
        brand: {
          50: "#eef0ff",
          100: "#dde2ff",
          200: "#bcc6ff",
          500: "#5567ff",
          600: "#2B45FF",
          700: "#1f34cc",
          800: "#16130D",
          900: "#16130D",
          950: "#0c0a06",
        },
        cobalt: "#2B45FF",
        coral: "#FF4D34",
        sun: "#FFC233",
        grass: "#16A85F",
        ultra: "#9A6BFF",
        pink: "#FF86C9",
      },
      boxShadow: {
        brutal: "4px 4px 0 0 #16130D",
        "brutal-lg": "7px 7px 0 0 #16130D",
        "brutal-sm": "2px 2px 0 0 #16130D",
        "brutal-color": "5px 5px 0 0 #2B45FF",
      },
      borderRadius: {
        none: "0",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

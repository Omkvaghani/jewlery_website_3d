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
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: {
          50: "#f8f6f1",
          100: "#efeae0",
          200: "#d8d0bf",
          300: "#a89d85",
          400: "#6f6857",
          500: "#3b372e",
          600: "#28251f",
          700: "#181612",
          800: "#0d0c0a",
          900: "#070605",
        },
        gold: {
          50: "#fff8e1",
          100: "#ffe9a8",
          200: "#f7d07a",
          300: "#e9b75c",
          400: "#cd9743",
          500: "#a87a31",
          600: "#7d5921",
        },
        platinum: {
          50: "#f7f8fa",
          100: "#e6e9ee",
          200: "#c7ccd5",
          300: "#a6abb6",
          400: "#7e8390",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-gold":
          "linear-gradient(135deg, #fff1c0 0%, #e9b75c 35%, #a87a31 65%, #fff1c0 100%)",
        "gradient-platinum":
          "linear-gradient(135deg, #ffffff 0%, #c7ccd5 35%, #7e8390 65%, #ffffff 100%)",
        "gradient-silver":
          "linear-gradient(135deg, #f5f7fa 0%, #c4cbd4 50%, #8a929c 100%)",
        "radial-spotlight":
          "radial-gradient(60% 50% at 50% 35%, rgba(255,231,180,0.18), rgba(0,0,0,0) 70%)",
      },
      boxShadow: {
        glass:
          "0 1px 0 rgba(255,255,255,0.06) inset, 0 30px 60px -20px rgba(0,0,0,0.6)",
        glow: "0 0 40px rgba(233,183,92,0.25)",
      },
      letterSpacing: {
        widest2: "0.32em",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        shimmer: "shimmer 6s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;

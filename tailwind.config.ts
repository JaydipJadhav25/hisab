import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F97316", // Primary Orange
          deep: "#EA580C", // Deep Orange
          50: "#FFF7ED",
        },
        food: {
          green: "#16A34A",
        },
        cream: "#FFF7ED",
        surface: "#FFFBF5",
        ink: {
          DEFAULT: "#292524", // Dark Text
          muted: "#78716C", // Muted Text
        },
        border: "#E7E5E4",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Fraunces'", "serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 2px 10px rgba(41, 37, 36, 0.06)",
        cardHover: "0 6px 20px rgba(41, 37, 36, 0.10)",
      },
    },
  },
  plugins: [],
} satisfies Config;

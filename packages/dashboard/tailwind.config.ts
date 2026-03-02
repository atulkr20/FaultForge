import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#060608",
        card: "#0d0d0f",
        border: "rgba(255, 255, 255, 0.05)",
        primary: "#ff3c3c",
        danger: "#ff3c3c",
        success: "#4cff91",
        warning: "#f5c842",
        text: {
          primary: "#f5f5f5",
          muted: "#888888",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      fontSize: {
        micro: "0.625rem",
      },
      boxShadow: {
        glow: "0 0 30px rgba(255, 60, 60, 0.3)",
        glowLarge: "0 0 40px rgba(255, 60, 60, 0.5)",
        primary: "0 0 20px rgba(255, 60, 60, 0.35)",
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        flicker: "flicker 1.5s infinite",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
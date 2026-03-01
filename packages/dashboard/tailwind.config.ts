import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0d10",
        card: "#111418",
        border: "#252a31",
        primary: "#b8c2cc",
        danger: "#dc5f5f",
        success: "#6fbe89",
        warning: "#d3a957",
        text: {
          primary: "#e5e7eb",
          muted: "#8b94a0",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(211, 169, 87, 0.22), 0 12px 30px rgba(0, 0, 0, 0.35)",
      },
      animation: {
        pulseSlow: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
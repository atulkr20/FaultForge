export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                bg: "#0a0a0f",
                card: "#111118",
                border: "#1e1e2e",
                primary: "#7c3aed",
                danger: "#ef4444",
                success: "#22c55e",
                warning: "#f59e0b",
                text: {
                    primary: "#f1f5f9",
                    muted: "#64748b",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["'JetBrains Mono'", "monospace"],
            },
            boxShadow: {
                glow: "0 0 0 1px rgba(124, 58, 237, 0.35), 0 0 28px rgba(124, 58, 237, 0.16)",
            },
            animation: {
                pulseSlow: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
        },
    },
    plugins: [],
};

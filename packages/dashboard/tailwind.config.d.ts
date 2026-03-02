declare const _default: {
    darkMode: ["class"];
    content: string[];
    theme: {
        extend: {
            colors: {
                bg: string;
                card: string;
                border: string;
                primary: string;
                danger: string;
                success: string;
                warning: string;
                text: {
                    primary: string;
                    muted: string;
                };
            };
            fontFamily: {
                sans: [string, string, string];
                mono: [string, string];
            };
            fontSize: {
                micro: string;
            };
            boxShadow: {
                glow: string;
                glowLarge: string;
                primary: string;
            };
            animation: {
                pulse: string;
                flicker: string;
            };
            keyframes: {
                flicker: {
                    "0%, 100%": {
                        opacity: string;
                    };
                    "50%": {
                        opacity: string;
                    };
                };
            };
        };
    };
    plugins: never[];
};
export default _default;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        surface: "#0A0A0F",
        "surface-elevated": "#111118",
        "surface-hover": "#1A1A24",
        border: "#1F1F2E",
        "border-strong": "#2A2A3C",
        primary: "#FFFFFF",
        secondary: "#8B8B9E",
        muted: "#5A5A6E",
        accent: "#6366F1",
        "accent-hover": "#4F46E5",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        turf: { DEFAULT: "#0c0a06", 2: "#141109", 3: "#1d1810" },
        chalk: { DEFAULT: "#f2ede2", dim: "#a49d8c" },
        flood: { DEFAULT: "#e2a83f", ink: "#9c6f1f" },
        card: "#b23a2e",
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
}


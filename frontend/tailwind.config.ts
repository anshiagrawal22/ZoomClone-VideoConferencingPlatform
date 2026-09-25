import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        zoom: {
          blue: "#0B5CFF",
          "blue-hover": "#004FE0",
          bg: "#FFFFFF",
          muted: "#F4F6F8",
          border: "#E7E9EB",
          text: "#242424",
          gray: "#6E7680",
          orange: "#F26D21",
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "SF Pro",
          "Segoe UI",
          "Almaden Sans",
          "Roboto",
          "Ubuntu",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;

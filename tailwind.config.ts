import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          lighter: "#FFF1E0",
          light: "#FFD199",
          main: "#DE8F2C",
          dark: "#AB630A",
          darker: "#3D2200",
        },
        secondary: {
          lighter: "#FFE3E0",
          light: "#FFA399",
          main: "#DD3C2C",
          dark: "#AB1B0B",
          darker: "#3D0600",
        },
        common: {
          white: "#FFFFFF",
          black: "#000000",
        },
        background: {
          default: "#FFFFFF",
          lightGrey: "#F6FAFB",
          neutral: "#F4F6F8",
        },
      },
    },
  },
  plugins: [],
};
export default config;

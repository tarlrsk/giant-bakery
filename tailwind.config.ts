import type { Config } from "tailwindcss";

import { nextui } from "@nextui-org/react";

// ----------------------------------------------------------------------

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      container: {
        center: true,
      },
      colors: {
        facebook: {
          main: "#0165E1",
        },
        primaryT: {
          lighter: "#FFF1E0",
          light: "#FFD199",
          main: "#DE8F2C",
          dark: "#AB630A",
          darker: "#3D2200",
        },
        secondaryT: {
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
  darkMode: "class",
  plugins: [
    nextui({
      defaultTheme: "light",
      themes: {
        light: {
          layout: {
            radius: {
              small: "2px", // rounded-small
              medium: "4px", // rounded-medium
              large: "8px", // rounded-large
            },
            borderWidth: {
              small: "0.5px", // border-small
              medium: "1px", // border-medium (default)
              large: "2px", // border-large
            },
          },

          colors: {
            primary: {
              100: "#FFF1E0",
              200: "#FFD199",
              300: "#DE8F2C",
              400: "#AB630A",
              500: "#3D2200",
              DEFAULT: "#DE8F2C",
              foreground: "#3D2200",
            },
            secondary: {
              100: "#FFE3E0",
              200: "#FFA399",
              300: "#DD3C2C",
              400: "#AB1B0B",
              500: "#3D0600",
              DEFAULT: "#DD3C2C",
              foreground: "#FFFFFF",
            },
            danger: {
              DEFAULT: "#DD3C2C",
            },
            default: {
              foreground: "#3D2200",
            },
            foreground: "#3D2200",
          },
        },
      },
    }),
  ],
};
export default config;

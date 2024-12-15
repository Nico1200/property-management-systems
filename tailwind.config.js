/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Nunito Sans", "sans-serif"],
    },
    extend: {
      strokeLinecap: {
        round: "round",
        butt: "butt",
        square: "square",
      },
    },
  },
  plugins: [
    require("tailwindcss-3d"),
    require("tailwind-scrollbar"),
    function ({ addUtilities }) {
      const newUtilities = {
        ".stroke-linecap-round": {
          "stroke-linecap": "round",
        },
        ".stroke-linecap-butt": {
          "stroke-linecap": "butt",
        },
        ".stroke-linecap-square": {
          "stroke-linecap": "square",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

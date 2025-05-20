/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
    screens: {
      sm: "400px", // decrease small breakpoint from 640px to support small phones (e.g. iPhone SE)
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
          ...require("daisyui/src/theming/themes")["bumblebee"],
          primary: "#FCE589",
        },
      },
      {
        dark: {
          // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#FCE589",
        },
      },
    ],
  },
};

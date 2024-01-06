/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        bumblebee: {
          // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
          ...require("daisyui/src/theming/themes")["bumblebee"],
          primary: "#FCE589",
        },
      },
    ],
  },
};

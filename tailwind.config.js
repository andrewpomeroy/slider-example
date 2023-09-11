const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.stone,
        primary: {
          DEFAULT: "#1CE783",
          light: "hsl(150.44deg 100% 87.78%)"
        },
        // background: "#F5F5F5",
      }
    },
  },
  plugins: [],
}
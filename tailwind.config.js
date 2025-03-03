/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Google Sans"', "Roboto", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./js/**/*.js",
    "./assets/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#B72780",
        "primary-dark": "#9A1F6B",
      },
      fontFamily: {
        sans: ["Nunito", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1080px",
      },
    },
  },
  plugins: [],
};

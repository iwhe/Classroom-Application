/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        hero: "url('./assets/empty-classroom.png')",
        designclass: "url('./assets/classroom2.png)",
      },
      colors: {
        customBlue: "rgb(205, 223, 255)",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#121212",
          surface: "#1E1E1E",
          surface2: "#2C2C2C",
          border: "#3A3A3A",
          text: "#EDEDED",
          subtext: "#B3B3B3",
          accent: "#BB86FC",
          teal: "#03DAC5",
          error: "#CF6679",
        },
      },
    },
  },
  plugins: [],
};

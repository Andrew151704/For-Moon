/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          900: '#11100F',
          800: '#1C1B1A',
          300: '#8A8782',
          100: '#E6E2D8',
        },
        ember: {
          500: '#D97746',
        }
      },
      fontFamily: {
        serif: ['"Newsreader"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

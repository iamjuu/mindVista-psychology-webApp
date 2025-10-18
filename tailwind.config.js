/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'manrope': ['Manrope', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#ffb5ea',
          50: '#fff5fc',
          100: '#ffebf9',
          200: '#ffd7f3',
          300: '#e53935',
          400: '#ff8bdd',
          500: '#ff5ccb',
          600: '#ff3ab8',
          700: '#ff1aa5',
          800: '#e6008c',
          900: '#cc0073',
        },
      },
    },
  },
  plugins: [],
}

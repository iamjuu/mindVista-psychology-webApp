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
      animation: {
        'blob': 'blob 7s infinite',
        'fadeInUp': 'fadeInUp 0.6s ease-out',
        'fadeIn': 'fadeIn 0.8s ease-in',
        'slideInLeft': 'slideInLeft 0.6s ease-out',
        'countUp': 'countUp 1s ease-out',
        'starPulse': 'starPulse 2s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'carousel': 'carousel 30s linear infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        slideInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        countUp: {
          '0%': {
            transform: 'scale(0.5)',
            opacity: '0',
          },
          '50%': {
            transform: 'scale(1.2)',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        starPulse: {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '50%': {
            transform: 'scale(1.2)',
            opacity: '0.8',
          },
        },
        blink: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
            opacity: '0.4',
          },
          '50%': {
            transform: 'translateY(-20px)',
            opacity: '0.8',
          },
        },
        carousel: {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-50%)',
          },
        },
      },
    },
  },
  plugins: [],
}

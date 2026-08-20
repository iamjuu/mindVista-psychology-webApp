/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'headline': ['Hanken Grotesk', 'sans-serif'],
        'serif': ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4a654e',
          container: '#8ba88e',
          fixed: '#cceace',
          'fixed-dim': '#b0ceb2',
        },
        'on-primary': '#ffffff',
        'on-primary-container': '#233d29',
        secondary: {
          DEFAULT: '#3a665f',
          container: '#bcece3',
          fixed: '#bcece3',
          'fixed-dim': '#a1d0c7',
        },
        'on-secondary': '#ffffff',
        'on-secondary-container': '#406c65',
        surface: {
          DEFAULT: '#fbf9f4',
          bright: '#fbf9f4',
          dim: '#dbdad5',
          variant: '#e4e2dd',
          'container-lowest': '#ffffff',
          'container-low': '#f5f3ee',
          container: '#f0eee9',
          'container-high': '#eae8e3',
          'container-highest': '#e4e2dd',
        },
        'on-surface': '#1b1c19',
        'on-surface-variant': '#424842',
        outline: {
          DEFAULT: '#737972',
          variant: '#c2c8c0',
        },
        tertiary: {
          DEFAULT: '#645a74',
          container: '#a89bb9',
          fixed: '#ebddfd',
          'fixed-dim': '#cfc1e0',
        },
        'on-tertiary-fixed': '#20172e',
        'on-tertiary-fixed-variant': '#4c425c',
      },
      spacing: {
        'container-max': '1280px',
        'margin-desktop': '64px',
        'margin-mobile': '20px',
        'gutter': '24px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2.5rem',
      },
    },
  },
  plugins: [],
};

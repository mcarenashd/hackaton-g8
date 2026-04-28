/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fbfb',
          100: '#d9f3f4',
          200: '#b6e7ea',
          300: '#86d4d9',
          400: '#4cb9c2',
          500: '#2f9aa6',
          600: '#287d8a',
          700: '#256570',
          800: '#22535c',
          900: '#1f454e',
        },
        leaf: {
          50: '#f3faf4',
          100: '#dff3e2',
          200: '#bde6c4',
          300: '#8fd29c',
          400: '#5fb872',
          500: '#3d9d51',
          600: '#2c7e3f',
          700: '#266434',
          800: '#22512d',
          900: '#1d4327',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

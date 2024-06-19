/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neutral': {
          0: '#FFFFFF',
          100: '#F5F5F5',
          200: '#E8E8EA',
          400: '#BDBDBD',
          500: '#9F9F9F',
          700: '#626262',
          900: '#222222'
        },
        'business': {
          50: '#E6EAF0',
          200: '#97A7C2',
          400: '#506C99',
          700: '#1F4376',
          800: '#19396A',
          900: '#112952'
        },
      },
      spacing: {
        18: '4.5rem',
      }
    },
  },
  plugins: [],
}

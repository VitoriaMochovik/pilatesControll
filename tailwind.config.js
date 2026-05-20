/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00786F',
        secondary: '#00A396',
        teal: {
          50: '#f0fdf9',
          100: '#ccf7f2',
          200: '#99efe5',
          300: '#66e7d8',
          400: '#33dfcb',
          500: '#00d7be',
          600: '#00b8a0',
          700: '#00786F',
          800: '#005f59',
          900: '#004643',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

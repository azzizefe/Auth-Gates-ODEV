/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#050508',
          800: '#0d0d14',
          700: '#1a1a24'
        }
      }
    },
  },
  plugins: [],
}

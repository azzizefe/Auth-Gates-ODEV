/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        security: {
          dark: '#0a0a0b',
          card: '#121214',
          border: '#1f1f23',
          red: '#f87171',
          orange: '#fb923c',
          green: '#4ade80',
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mystical: {
          purple: '#4C1D95',
          gold: '#F59E0B',
          dark: '#1F2937',
          light: '#F3F4F6'
        }
      }
    },
  },
  plugins: [],
}
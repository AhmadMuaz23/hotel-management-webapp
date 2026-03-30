/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdfbf7', // Pearl/Off-white background
          100: '#f7f2ea', // Warm Cream background
          200: '#e3d2be', // Slightly darker border color
          300: '#ae8c71', // Mid-tone for secondary text (Darker and more legible)
          400: '#75543c', // Main secondary text (Legible on light background)
          500: '#462e1d', // Important text/Elements (Much darker)
          600: '#1e1108', // Primary text / Deep black-brown (Highest contrast)
        },
        accent: {
          DEFAULT: '#8b5e3c', // Earthy accent
          gold: '#c5a059',
          warm: '#fdf4e3',
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}


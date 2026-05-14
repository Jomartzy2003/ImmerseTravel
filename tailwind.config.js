/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#121212',
        'forest-mist': '#A3B18A',
        'champagne-cream': '#F2E9E4',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        'glass': '12px',
      },
    },
  },
  plugins: [],
}

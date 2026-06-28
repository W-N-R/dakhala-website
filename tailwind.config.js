/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cloudy: '#EBF5F4', // Extremely soft pale minty off-white background
        surface: '#F8FDFD', // Super clean surface white with a minty whisper
        ink: '#1D2E28', // Customized dark forest green/black text
        gold: '#0B5D56', // Brand deep forest teal/emerald accent
        goldDark: '#064842', // Darker brand deep forest teal
        muted: '#556E6B', // Cool grey-teal text
        border: '#DDEEEB', // Very soft minty white border
        maqsadNavy: '#051110', // Deepest dark forest teal for dark mode background
        maqsadOrange: '#14B8A6', // Soft teal/mint
        maqsadYellow: '#0D9488', // Intermediate teal
        maqsadBlue: '#0B5D56', // Brand teal
        maqsadPeach: '#EAF6F5', // Very light pale mint background
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Libre Baskerville"', 'Georgia', 'serif'],
      },
      boxShadow: {
        none: 'none',
      },
    },
  },
  plugins: [],
}

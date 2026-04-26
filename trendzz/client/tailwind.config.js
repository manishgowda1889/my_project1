/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B00',
          dark: '#E66000',
          light: '#FF8533',
        },
        accent: {
          DEFAULT: '#FFD700',
          dark: '#CCAC00',
          light: '#FFE033',
        },
        dark: {
          DEFAULT: '#111827',
          lighter: '#1F2937',
          lightest: '#374151',
        },
        light: {
          DEFAULT: '#F9FAFB',
          darker: '#F3F4F6',
          darkest: '#E5E7EB',
        }
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

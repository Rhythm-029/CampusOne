/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FBFBF9',
          alt: '#F4F3EF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8F7F4',
        },
        border: {
          DEFAULT: '#EBEAE5',
          subtle: '#E2E0D8',
        },
        navy: {
          900: '#111C2D',
          800: '#1B2A4A',
          700: '#263B60',
          500: '#475569',
          400: '#64748B',
        },
        forest: {
          900: '#152C22',
          DEFAULT: '#1E3F30',
          700: '#2D5A47',
          light: '#EAF2EC',
        },
        sand: {
          DEFAULT: '#C2B092',
          light: '#FAF7F2',
          card: '#F3EFEA',
        },
        terracotta: {
          DEFAULT: '#BA4A38',
          light: '#FDF1EF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}

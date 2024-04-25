import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      'light-grey': '#F6F6F8'
    },
    extend: {},
  },
  plugins: [],
} satisfies Config


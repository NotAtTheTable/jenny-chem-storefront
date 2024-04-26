import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      'light-grey': '#F6F6F8',
      'jc-dark-blue': '#17255D',
      'jc-light-blue': '#7094E0'
    },
    extend: {},
  },
  plugins: [],
} satisfies Config


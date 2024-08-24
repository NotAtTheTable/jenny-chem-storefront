import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    fontFamily: {
      body: ["Cabin", "Roboto", "sans-serif"],
      display: ["Bebas Neue", "Roboto", "sans-serif"]
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      height: {
        '70': '17.4rem'
      },
      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '4.4rem' }],
        '8xl': ['6rem', { lineHeight: '5.7rem', letterSpacing: "0.2rem" }],
        '9xl': ['8rem', { lineHeight: '7rem' }]
      },
      colors: {
        'jc-light-grey': '#F0F0F8',
        'jc-light-blue': '#7094E0',
        'jc-light-blue-100': '#B2C1E0',
        'jc-dark-blue-100': '#080D3F',
        'jc-dark-blue': '#17255D',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  safelist: [{
    pattern: /(bg|text|border)-jc-(light|dark)-(blue|grey)/
  }],
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
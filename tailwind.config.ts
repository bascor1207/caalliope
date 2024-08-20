import type { Config } from 'tailwindcss'
import { nextui } from '@nextui-org/react';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      colors: {
        'custom-purple': '#f8e9ff',
        'custom-grey': '#F6F6F6',
        'custom-dark-purple': '#7C0149'
      }
    },
  },
  plugins: [require('tailwindcss-animate'), nextui({
    defaultTheme: 'light',
    defaultExtendTheme: 'light',
    themes: {
      light: {
        colors: { default: '#F6F6F6', secondary: '#7C0149' },
      },
    }
  })],
} satisfies Config

export default config

import { nextui } from '@nextui-org/react';

import type { Config } from 'tailwindcss'

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
      colors: {
        'custom-purple': '#f8e9ff',
        'custom-grey': '#F6F6F6',
        'custom-dark-purple': '#7C0149'
      }
    },
  },
  plugins: [nextui({
    defaultTheme: 'light',
    defaultExtendTheme: 'light',
    themes: {
      light: {
        colors: { default: '#F6F6F6', primary: '#f8e9ff', secondary: '#7C0149' },
      },
    }
  })],
} satisfies Config

export default config

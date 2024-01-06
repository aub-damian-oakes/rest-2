/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'finch': {
          '50': '#f5f5f0',
          '100': '#e8e9de',
          '200': '#d4d6c0',
          '300': '#b7bb9b',
          '400': '#9ca279',
          '500': '#80865c',
          '600': '#6a704b',
          '700': '#4d5239',
          '800': '#404331',
          '900': '#383b2c',
          '950': '#1c1e15',
        },
      }
    },
  },
  plugins: [],
}

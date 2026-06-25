import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0c3877',
          800: '#0a2e6b',
          700: '#0f4499',
          600: '#1a58c8',
          950: '#061b45',
        },
        brand: {
          yellow: '#ffbc0f',
        },
      },
    },
  },
  plugins: [],
}

export default config

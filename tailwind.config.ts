import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '320px',
      ...defaultTheme.screens,
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50rem 50rem, var(--tw-gradient-stops))',
      },
      animation: {
        cursor: 'cursor 40s linear infinite',
      },
      keyframes: {
        cursor: {
          '0%': { transform: 'translate(85vw, 10vh)' },
          '5%': { transform: 'translate(80vw, 15vh)' },
          '10%': { transform: 'translate(70vw, 30vh)' },
          '15%': { transform: 'translate(55vw, 45vh)' },
          '20%': { transform: 'translate(40vw, 6vh)' },
          '25%': { transform: 'translate(25vw, 10vh)' },
          '30%': { transform: 'translate(10vw, 9vh)' },
          '35%': { transform: 'translate(25vw, 5vh)' },
          '40%': { transform: 'translate(40vw, 12vh)' },
          '41%': { transform: 'translate(40vw, 12vh)' },
          '42%': { transform: 'translate(40vw, 12vh)' },
          '43%': { transform: 'translate(40vw, 12vh)' },
          '44%': { transform: 'translate(40vw, 12vh)' },
          '45%': { transform: 'translate(45vw, 13vh)' },
          '50%': { transform: 'translate(50vw, 15vh)' },
          '55%': { transform: 'translate(55vw, 35vh)' },
          '60%': { transform: 'translate(40vw, 12vh)' },
          '65%': { transform: 'translate(25vw, 15vh)' },
          '70%': { transform: 'translate(10vw, 9vh)' },
          '75%': { transform: 'translate(25vw, 7vh)' },
          '80%': { transform: 'translate(40vw, 6vh)' },
          '85%': { transform: 'translate(55vw, 5vh)' },
          '90%': { transform: 'translate(70vw, 20vh)' },
          '95%': { transform: 'translate(85vw, 15vh)' },
          '100%': { transform: 'translate(100vw, 10vh)' },
        },
      },
    },
  },
  plugins: [],
}
export default config

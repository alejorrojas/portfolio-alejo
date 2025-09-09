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
        cursor: 'cursor 45s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'cursor-organic': 'cursor-organic 50s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
      },
      keyframes: {
        cursor: {
          '0%': { 
            transform: 'translate(85vw, 10vh)',
            animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          },
          '3%': { 
            transform: 'translate(83vw, 12vh)',
            animationTimingFunction: 'ease-out'
          },
          '6%': { 
            transform: 'translate(80vw, 15vh)',
            animationTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
          },
          '12%': { 
            transform: 'translate(70vw, 30vh)',
            animationTimingFunction: 'ease-in-out'
          },
          '18%': { 
            transform: 'translate(55vw, 45vh)',
            animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          },
          '22%': { 
            transform: 'translate(52vw, 43vh)',
            animationTimingFunction: 'ease-out'
          },
          '26%': { 
            transform: 'translate(40vw, 6vh)',
            animationTimingFunction: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)'
          },
          '30%': { 
            transform: 'translate(25vw, 10vh)',
            animationTimingFunction: 'ease-in-out'
          },
          '34%': { 
            transform: 'translate(10vw, 9vh)',
            animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          },
          '38%': { 
            transform: 'translate(25vw, 5vh)',
            animationTimingFunction: 'ease-out'
          },
          '42%': { 
            transform: 'translate(40vw, 12vh)',
            animationTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
          },
          '43%': { 
            transform: 'translate(40.5vw, 12.2vh)',
            animationTimingFunction: 'ease-in-out'
          },
          '44%': { 
            transform: 'translate(40.2vw, 11.8vh)',
            animationTimingFunction: 'ease-in-out'
          },
          '45%': { 
            transform: 'translate(40.8vw, 12.3vh)',
            animationTimingFunction: 'ease-in-out'
          },
          '46%': { 
            transform: 'translate(40.1vw, 11.9vh)',
            animationTimingFunction: 'ease-in-out'
          },
          '47%': { 
            transform: 'translate(40vw, 12vh)',
            animationTimingFunction: 'ease-in-out'
          },
          '50%': { 
            transform: 'translate(45vw, 13vh)',
            animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          },
          '55%': { 
            transform: 'translate(50vw, 15vh)',
            animationTimingFunction: 'ease-in-out'
          },
          '60%': { 
            transform: 'translate(55vw, 35vh)',
            animationTimingFunction: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)'
          },
          '64%': { 
            transform: 'translate(40vw, 12vh)',
            animationTimingFunction: 'ease-out'
          },
          '68%': { 
            transform: 'translate(25vw, 15vh)',
            animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          },
          '72%': { 
            transform: 'translate(10vw, 9vh)',
            animationTimingFunction: 'ease-in-out'
          },
          '76%': { 
            transform: 'translate(25vw, 7vh)',
            animationTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
          },
          '80%': { 
            transform: 'translate(40vw, 6vh)',
            animationTimingFunction: 'ease-out'
          },
          '84%': { 
            transform: 'translate(55vw, 5vh)',
            animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          },
          '88%': { 
            transform: 'translate(70vw, 20vh)',
            animationTimingFunction: 'ease-in-out'
          },
          '94%': { 
            transform: 'translate(85vw, 15vh)',
            animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          },
          '97%': { 
            transform: 'translate(95vw, 12vh)',
            animationTimingFunction: 'ease-out'
          },
          '100%': { 
            transform: 'translate(100vw, 10vh)',
            animationTimingFunction: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)'
          },
        },
        'cursor-organic': {
          '0%': { 
            transform: 'translate(75vw, 8vh) rotate(0deg) scale(1)',
            opacity: '0.8'
          },
          '2%': { 
            transform: 'translate(72vw, 12vh) rotate(-2deg) scale(1.05)',
            opacity: '0.9'
          },
          '5%': { 
            transform: 'translate(65vw, 25vh) rotate(1deg) scale(0.95)',
            opacity: '1'
          },
          '8%': { 
            transform: 'translate(50vw, 40vh) rotate(-1deg) scale(1.02)',
            opacity: '0.85'
          },
          '12%': { 
            transform: 'translate(35vw, 20vh) rotate(2deg) scale(0.98)',
            opacity: '0.95'
          },
          '15%': { 
            transform: 'translate(20vw, 15vh) rotate(0deg) scale(1.03)',
            opacity: '1'
          },
          '18%': { 
            transform: 'translate(15vw, 35vh) rotate(-2deg) scale(0.97)',
            opacity: '0.9'
          },
          '22%': { 
            transform: 'translate(30vw, 50vh) rotate(1deg) scale(1.01)',
            opacity: '0.8'
          },
          '25%': { 
            transform: 'translate(45vw, 30vh) rotate(-1deg) scale(1.04)',
            opacity: '0.95'
          },
          '28%': { 
            transform: 'translate(45.2vw, 30.1vh) rotate(0deg) scale(1.02)',
            opacity: '1'
          },
          '30%': { 
            transform: 'translate(44.8vw, 29.9vh) rotate(1deg) scale(0.99)',
            opacity: '0.98'
          },
          '32%': { 
            transform: 'translate(45.3vw, 30.2vh) rotate(-1deg) scale(1.01)',
            opacity: '0.96'
          },
          '35%': { 
            transform: 'translate(60vw, 25vh) rotate(2deg) scale(0.98)',
            opacity: '0.9'
          },
          '40%': { 
            transform: 'translate(75vw, 45vh) rotate(-2deg) scale(1.05)',
            opacity: '0.85'
          },
          '45%': { 
            transform: 'translate(55vw, 60vh) rotate(1deg) scale(0.96)',
            opacity: '0.95'
          },
          '50%': { 
            transform: 'translate(40vw, 45vh) rotate(0deg) scale(1.02)',
            opacity: '1'
          },
          '55%': { 
            transform: 'translate(25vw, 25vh) rotate(-1deg) scale(0.99)',
            opacity: '0.9'
          },
          '60%': { 
            transform: 'translate(10vw, 20vh) rotate(2deg) scale(1.03)',
            opacity: '0.85'
          },
          '65%': { 
            transform: 'translate(20vw, 40vh) rotate(-2deg) scale(0.97)',
            opacity: '0.95'
          },
          '70%': { 
            transform: 'translate(40vw, 15vh) rotate(1deg) scale(1.01)',
            opacity: '1'
          },
          '75%': { 
            transform: 'translate(60vw, 10vh) rotate(0deg) scale(0.98)',
            opacity: '0.9'
          },
          '80%': { 
            transform: 'translate(80vw, 30vh) rotate(-1deg) scale(1.04)',
            opacity: '0.85'
          },
          '85%': { 
            transform: 'translate(70vw, 50vh) rotate(2deg) scale(0.96)',
            opacity: '0.95'
          },
          '90%': { 
            transform: 'translate(85vw, 35vh) rotate(-2deg) scale(1.02)',
            opacity: '1'
          },
          '95%': { 
            transform: 'translate(90vw, 20vh) rotate(1deg) scale(0.99)',
            opacity: '0.9'
          },
          '100%': { 
            transform: 'translate(95vw, 8vh) rotate(0deg) scale(1)',
            opacity: '0.8'
          },
        },
      },
    },
  },
  plugins: [],
}
export default config

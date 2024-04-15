/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.jsx',
    './src/**/*.css',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      translate: {
        '64': '16rem',
      },
      colors: {
        pastel: '#f3dabc',
        brown:'#6D4C3C',
        'light-text': '#000000', 
        'dark-text': '#ffffff',
      },
      backgroundImage: theme => ({
        'light-gradient': 'linear-gradient(to right, #D6BCFA, #9983B5)',
        'dark-gradient': 'linear-gradient(to right, #281343, #4F2683)', 
      })
    },
  },
  plugins: [],
}

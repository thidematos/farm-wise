/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        amareloClaro: `#F5F0BB`,
        amareloEscuro: '#DBDFAA',
        verdinho: '#B3C890',
        azulAgua: '#73A9AD',
        contraste: '#AD4300',
      },
      fontFamily: {
        raleway: 'Raleway',
        bree: 'Bree Serif',
        handWrite: 'Shadows Into Light',
      },
    },
  },
  plugins: [],
};

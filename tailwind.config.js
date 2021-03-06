module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.js',
  ],
  important: true,

  theme: {
    fontFamily: {
      display: [ 'Fira Sans', 'sans-serif' ],
      body: [ 'Fira Sans', 'sans-serif', 'Fira Mono' ],
    },

    extend: {
      minWidth: {
        '0':    '0',
        '1/4':  '25%',
        '1/5':  '20%',
        '1/3':  '33%',
        '2/5':  '40%',
        '1/2':  '50%',
        '3/5':  '60%',
        '2/3':  '66%',
        '3/4':  '75%',
        '4/5':  '80%',
        'full': '100%',
      },
    },
  },
  variants: {},
  plugins: [],
}

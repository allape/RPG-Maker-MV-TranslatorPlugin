const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/AutoTranslator.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

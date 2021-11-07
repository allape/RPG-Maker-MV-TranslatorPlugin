const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/AutoTranslator.js',
  output: {
    filename: 'Auto_Translator.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

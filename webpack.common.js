const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'public'),
  },
};

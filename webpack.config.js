
const path = require('path');

module.exports = {
  entry: './src/browser.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack.bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  }
};

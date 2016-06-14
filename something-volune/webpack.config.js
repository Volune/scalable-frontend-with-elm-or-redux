const path = require('path');
const webpack = require('webpack');

module.exports = {
  debug: true,
  target: 'web',
  devtool: 'sourcemap',
  plugins: [
    new webpack.NoErrorsPlugin(),
  ],
  entry: [
    'babel-polyfill',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    path.resolve(__dirname, 'src', 'app', 'index.js'),
  ],
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: 'app.bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [
          'babel',
        ],
        include: path.resolve(__dirname, 'src'),
      },
    ],
  },
  resolve: {
    alias: {
      engine: path.resolve(__dirname, 'src', 'engine'),
      modules: path.resolve(__dirname, 'src', 'modules'),
    },
    extensions: ['', '.js', '.jsx'],
  },
};

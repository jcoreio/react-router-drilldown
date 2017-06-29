/* eslint-env node */

var webpack = require('webpack')

module.exports = {
  entry: './stories/standaloneDemo',
  output: {
    path: __dirname,
    filename: 'demo.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      }
    }),
  ]
}


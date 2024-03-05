'use strict'

/* eslint-env node */

const webpack = require('webpack')
const path = require('path')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const env = process.env.NODE_ENV
const isTest = env === 'test'
const isProd = env === 'production'

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(env),
  }),
  new ProgressPlugin({ profile: false }),
]

const externals = isTest
  ? {
      cheerio: 'window',
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': true,
    }
  : {}

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isTest ? 'source-map' : 'eval',
  output: isTest
    ? {
        library: 'reactRouterDrilldown',
        libraryTarget: 'umd',
      }
    : {
        path: path.join(__dirname, 'demo'),
        filename: 'bundle.js',
      },
  plugins,
  resolve: {
    alias: {
      'react-router-drilldown': path.join(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          cacheDirectory: true,
          presets: [
            ['@babel/preset-env', { targets: { browsers: 'last 2 versions' } }],
            '@babel/preset-react',
            '@babel/preset-flow',
          ],
        },
        test: /\.js$/,
      },
      {
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          cacheDirectory: true,
          presets: [
            ['@babel/preset-env', { targets: { browsers: 'last 2 versions' } }],
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
        },
        test: /\.tsx?$/,
      },
    ],
  },
  externals,
}

if (!isTest) {
  module.exports.entry = ['@babel/polyfill', './demo/index.tsx']
  module.exports.devServer = {
    port: 3000,
    // contentBase: path.join(__dirname, "demo"),
  }
}

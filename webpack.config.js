'use strict';
const path = require('path');
const webpack = require('webpack');

const libraryName = 'MobxReactRouter';
const env = process.env.NODE_ENV || 'development';
const isDev = env === 'development';
const shouldMinify = Boolean(process.env.MINIFY);

module.exports = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'source-map' : false,
  entry: [path.resolve(__dirname, 'index.js')],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: shouldMinify
      ? 'mobx-react-router.min.js'
      : 'mobx-react-router.js',
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this'
  },
  optimization: {
    minimize: shouldMinify
  },
  externals: [
    {
      mobx: {
        root: 'Mobx',
        commonjs2: 'mobx',
        commonjs: 'mobx',
        amd: 'mobx'
      }
    }
  ],
  module: {
    rules: [
      {
        test: /\.(j|t)s$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader?cacheDirectory=true',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    new webpack.optimize.OccurrenceOrderPlugin()
  ]
};

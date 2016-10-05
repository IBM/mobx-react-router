'use strict';
const path = require('path');
const webpack = require('webpack');

const libraryName = 'MobxReactRouter';
const env = process.env.ENV || 'development';

let outputFile;
const plugins = [
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(env)
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurrenceOrderPlugin()
];

if (env === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin(
    {
      minimize: true,
      compress: {
        warnings: false
      },
      mangle: true
    }
  ));
  outputFile = 'mobx-react-router.min.js';
} else {
  outputFile = 'mobx-react-router.js';
}

module.exports = {
  devtool: 'source-map',
  entry: [path.resolve(__dirname, 'index.js')],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
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
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader?cacheDirectory'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: plugins
};

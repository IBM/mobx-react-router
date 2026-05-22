'use strict';
const path = require('path');
const webpack = require('webpack');

const libraryName = 'MobxReactRouter';
const env = process.env.NODE_ENV || 'development';
const isDev = env === 'development';
const shouldMinify = Boolean(process.env.MINIFY);

const entry = [path.resolve(__dirname, 'index.js')];

const babelRule = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader?cacheDirectory=true',
    options: {
      presets: ['@babel/preset-env']
    }
  }
};

const definePlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(env)
});

const umdConfig = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'source-map' : false,
  entry,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: shouldMinify ? 'mobx-react-router.min.js' : 'mobx-react-router.js',
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
      },
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    }
  ],
  module: { rules: [babelRule] },
  resolve: { extensions: ['.js'] },
  plugins: [definePlugin]
};

const esmConfig = {
  mode: isDev ? 'development' : 'production',
  devtool: false,
  entry,
  experiments: { outputModule: true },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'mobx-react-router.esm.js',
    library: { type: 'module' }
  },
  optimization: { minimize: false },
  externals: ['mobx', 'react'],
  module: { rules: [babelRule] },
  resolve: { extensions: ['.js'] },
  plugins: [definePlugin]
};

module.exports = [umdConfig, esmConfig];

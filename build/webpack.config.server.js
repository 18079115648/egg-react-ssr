
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const nodeExternals = require('webpack-node-externals')
const paths = require('./paths')

const getClientEnvironment = require('./env');
const isDev = process.env.NODE_ENV === 'development'
const productionConfig = require('./config');
const publicPath = isDev ? '/' : productionConfig.cdn + '/';
const publicUrl = process.env.PUBLIC_URL = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

const plugins = [
  new webpack.DefinePlugin({
    __isBrowser__: false,
    'process.env.PUBLIC_URL': JSON.stringify(publicUrl)
  })
]
module.exports = merge(baseConfig, {
  devtool: isDev ? 'eval-source-map' : '',
  entry: {
    Page: paths.entry
  },
  target: 'node',
  externals: nodeExternals({
    whitelist: /\.(css|less|sass|scss)$/
  }),
  output: {
    path: paths.appBuild,
    publicPath: '/',
    filename: '[name].server.js',
    libraryTarget: 'commonjs2'
  },
  plugins: plugins
})

const webpack = require('webpack');
const merge = require('webpack-merge');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const css = require('./webpack/rules/css');
const js = require('./webpack/rules/js-jsx');
const ts = require('./webpack/rules/ts-tsx');
const ImageminWebp = require('./webpack/plugins/imagemin-webp');
const devserver = require('./webpack/devserver');
const SVGSpritePlugin = require('./webpack/plugins/svgspritemap-plugin');
const baseWebpackConfig = require('./webpack.base.config');

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new CaseSensitivePathsPlugin(),
  ImageminWebp('development'),
  SVGSpritePlugin(process.env.NODE_ENV, `${baseWebpackConfig.externals.paths.src}/assets/images/sprite`),
];

const devWebpackConfig = merge([
  baseWebpackConfig,
  {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    watchOptions: {
      ignored: /node_modules/,
    },
    plugins,
  },
  css('development', `${baseWebpackConfig.externals.paths.src}/styles/resources`),
  js(),
  ts(),
  devserver(),
]);

module.exports = devWebpackConfig;

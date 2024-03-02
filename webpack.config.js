/* eslint-disable @typescript-eslint/no-var-requires */
// webpack will throw error if 'import' statement used instead of require statement
// but TypeScript will use ES6 modules in rest of project, so just disabled the rule for this file

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WebpackBar = require('webpackbar');
require('dotenv').config();
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { NODE_ENV = 'production' } = process.env;

module.exports = {
  mode: NODE_ENV,
  devtool: NODE_ENV === 'development' ? 'inline-source-map' : undefined,
  watch: NODE_ENV === 'development',
  entry: './src/client/index.tsx',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              '@babel/preset-typescript',
              '@babel/preset-env',
            ],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(svg|png|gif|jpg|ico)$/i,
        include: path.resolve(__dirname, './favicon.ico'),
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './src/client/dist'),
    publicPath: '/',
  },
  plugins: [
    new WebpackBar(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/client/index.ejs'),
    }),
    new FaviconsWebpackPlugin({
      logo: './public/placeholderLogo.svg',
      mode: 'webapp',
    }),
    // new BundleAnalyzerPlugin()
  ],
};

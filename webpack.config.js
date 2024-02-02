/* eslint-disable @typescript-eslint/no-var-requires */
// webpack will throw error if 'import' statement used instead of require statement
//but TypeScript will use ES6 modules in rest of project, so just disabled the rule for this file

const path = require('path');

module.exports = {
  mode: 'development',
  watch: true,
  entry: './src/client/index.tsx',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './src/client/dist'),
  },
};

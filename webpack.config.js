const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPLugin = require('copy-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: {
    index: './index.js',
    options: './options.js',
  },
  output: {
    path: __dirname + '/dist',
    filename: "[name].bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'view/index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: 'view/popup.html',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      template: 'view/options.html',
      chunks: ['options'],
    }),
    new CopyWebpackPLugin([
      {
        from: 'manifest.json',
        to: 'manifest.json',
      },
      {
        from: 'assets',
      }
    ])
  ],
};

const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    app: [
      '@babel/polyfill',
      'react-hot-loader/patch',
      path.resolve(__dirname, '..', 'src/index.js'),
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, '../dist/'),
    host: 'localhost',
    port: 8081,
    hot: true,
    overlay: true,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '..', 'src/index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
}

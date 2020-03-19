const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    app: [
      '@babel/polyfill',
      'react-hot-loader/patch',
      path.resolve(__dirname, '..', 'src/index.js')
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, '../dist/'),
    host: '0.0.0.0',
    port: 8081,
    hot: true,
    overlay: true,
    historyApiFallback: true
    // proxy: {
    //   '/': {
    //     target: 'http://47.104.198.34:8080/',
    //     secure: true,
    //     changeOrigin: true
    //   }
    // }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}

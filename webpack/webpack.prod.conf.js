const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // js压缩
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') // css压缩
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const getFiles = require('./webpack.entry.js')

const NODE_ENV = process.env.NODE_ENV || 'development'
const path = require('path')

const ExtractCSS = new MiniCssExtractPlugin({
  filename: 'css/[name].[hash].css',
  chunkFilename: 'css/[id].[hash].css'
})

const entrys = getFiles()

const plugins = [
  new CleanWebpackPlugin(['dist'], {
    root: path.resolve(__dirname, '../'),
    verbose: true
  }),
  ExtractCSS
]

entrys.forEach(pathname => {
  pathname = pathname.toLowerCase()
  let conf = {
    filename: `${pathname}.html`,
    template: path.resolve(__dirname, '..', 'src/index.html'),
    chunks: [pathname, 'vendor', 'echarts', 'lodash'],
    minify: {
      removeComments: true,
      collapseWhitespace: true
    }
  }
  plugins.push(new HtmlWebpackPlugin(conf))
})

const addEntry = () => {
  let entryObj = {}
  entrys.forEach(item => {
    entryObj[item.toLowerCase()] = [
      path.resolve(__dirname, '..', `src/container/${item}/render.js`)
    ]
  })
  console.log(entryObj)
  return entryObj
}

// if (NODE_ENV !== 'production') {
//   plugins.push(new BundleAnalyzerPlugin())
// }

module.exports = {
  mode: 'production',
  entry: addEntry(),
  optimization: {
    minimizer: [
      // 压缩js
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      minChunks: 3,
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: /[\\/]node_modules[\\/]react/,
          enforce: true
        },
        lodash: {
          chunks: 'initial',
          name: 'lodash',
          test: /[\\/]node_modules[\\/]lodash/,
          enforce: true
        },
        echarts: {
          chunks: 'initial',
          name: 'echarts',
          test: /[\\/]node_modules[\\/]echarts/,
          enforce: true
        }
      }
    }
  },
  plugins
}

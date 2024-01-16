const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const CopyPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    scripts: [
      './src/js/script.js',
      './src/scss/style.scss',
      './src/index.html',
    ]
  },
  resolve: {
    extensions: [".js", ".sass", ".scss", ".css"],
    modules: ['./node_modules/'],
  },
  mode: 'development',
  devtool: `source-map`,
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    port: 7777
  },
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '',
    filename: 'js/script.js'
  },
  module: {
    rules: [
      {
        test: /\.s[a|c]ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: false
            },
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true },
          }
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: false
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
            attributes: false
            }
          },
          {
            loader: 'posthtml-loader',
            options: {
              plugins: [
                require('posthtml-include')({ root: 'src' })
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new WriteFilePlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/style.min.css',
      chunkFilename: "[id].css"
    }),
    new CssoWebpackPlugin({
      pluginOutputPostfix: 'min'
    }),
    new CopyPlugin([
      {
        from: "src/fonts/**/*.{woff,woff2}",
        to: path.join(__dirname, 'build', 'fonts'),
        flatten: true,
      },
      {
        from: "src/img/**",
        to: path.join(__dirname, 'build'),
        transformPath(targetPath) {
          return targetPath.replace(`src${path.sep}`, '');
        },
      },
      {
        from: "src/*.ico",
        to: path.join(__dirname, 'build'),
        flatten: true,
      },
      {
        from: "src/**/*.html", //"src/*.html", - так было
        to: path.join(__dirname, 'build'),
        flatten: true,
      }
    ]),
  ]
};

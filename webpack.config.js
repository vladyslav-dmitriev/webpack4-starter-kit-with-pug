const path = require('path');
const argv = require('yargs').argv;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDevelopment = argv.mode === 'development';
const isProduction = !isDevelopment;
const distPath = path.join(__dirname, '/dist');

const config = {
  entry: {
    main: './src/js/index.js'
  },
  output: {
    filename: 'js/[name].js',
    path: distPath
  },
  module: {
    rules: [
    {
      test: /\.pug$/,
        use: [
          "html-loader",
          "pug-html-loader"
        ]
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }]
    }, {
      test: /\.(scss|sass)$/i,
      exclude: /node_modules/,
      use: [
        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            minimize: isProduction
          }
        },
        'postcss-loader',
        'sass-loader'
      ]
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.(gif|png|jpe?g|svg)$/i,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]'
        }
      }],
    }, {
      test: /\.(eot|ttf|woff|woff2)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: 'fonts/[name]/[name].[ext]'
        }
      },
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.pug',
      filename: './index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: '[id].css'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new CopyWebpackPlugin([
      {
        from: './src/libs',
        to: 'libs'
      },
      {
        from: './src/img',
        to: 'img'
      },
      {
        from: './src/fonts',
        to: 'fonts'
      }
    ]),
  ],
  optimization: isProduction ? {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: {
            inline: false,
            warnings: false,
            drop_console: true,
            unsafe: true
          },
        },
      }),
    ],
  } : {},
  devServer: {
    contentBase: distPath,
    port: 9000,
    compress: true,
    open: true
  }
};

module.exports = config;

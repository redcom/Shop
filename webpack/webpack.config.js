var path = require('path');
var Webpack = require('webpack');
var server = require('./utils/app-server');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var dir_src_client = path.resolve(__dirname, '../src/client');
var dir_build_client = path.resolve(__dirname, '../src/client');

var NODE_ENV = process.env.NODE_ENV; //variable of the scope

module.exports = {
    entry: {
        shop: [
            'webpack-dev-server/client',
            'webpack/hot/dev-server',
            dir_src_client,
        ]
    },

    output: {
        path: path.join(__dirname, '../src/client/build'),
        filename: '[name]-build.js',
        publicPath: '/'
    },

  devServer: {
    contentBase: dir_build_client,
    stats: {
      assets: false,
      chunks: false,
      colors: true,
      hash: false,
      version: false,
    },
  },

  module: {
    loaders: [
      {
        test: dir_src_client,
        loader: 'babel-loader',
        query: {
          cacheDirectory: './tmp',
          compact: true,
        }
      },
      { test: /\.html/, loader: 'html-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.json5$/, loader: 'json5-loader' },
      { test: /\.(png|jpg|jpeg|gif)$/, loader: 'file-loader' },
      { test: /\.(woff|woff2)$/, loader: 'url-loader?limit=100000' },
      { test: /\.(ttf|eot|wav|mp3|svg|eot|woff|woff2)$/, loader: 'file?name=[name].[ext][hash]' },
      { test: /\.(wav|mp3)$/, loader: 'file-loader' },
      { test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css-loader?minimize!less-loader') },
      { test: /\.(sass|scss)$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?minimize!sass-loader') },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?minimize') }
    ]
  },

    progress: true,
    devtool: NODE_ENV === 'development' ? "module-eval-source-map" : null,

    resolve: {
        modulesDirectories: ['node_modules', 'src/client', 'src/server'],
        extensions: ['',  '.js', '.json', 'css', 'scss']
    },

    plugins: [
        new ExtractTextPlugin('[name]-build.css'),
        new Webpack.HotModuleReplacementPlugin(),
        new Webpack.NoErrorsPlugin(),

        new Webpack.DefinePlugin({
            'process.env': {
                BROWSER: JSON.stringify(true),
                NODE_ENV: JSON.stringify('development')
            }
        }),

        function () {
            this.plugin("done", function(stats) {
                if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1)
                {
                    console.log(stats.compilation.errors);
                } else {
                    console.log('success build');
                    server();
                }
            });
        }
    ]
};

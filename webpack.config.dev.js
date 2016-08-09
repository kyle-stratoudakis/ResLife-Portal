var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client',
    './app/Portal'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
    // js
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      include: path.join(__dirname, 'app')
    },
    // CSS
    { 
      test: /\.styl$/, 
      include: path.join(__dirname, 'app'),
      loader: 'style-loader!css-loader!stylus-loader'
    },
    // Static images
    {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=8192'
    }
    ]
  }
};

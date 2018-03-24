const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        hot: true,
        historyApiFallback: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new OpenBrowserPlugin({ url: 'http://localhost:8080' })
    ]
});
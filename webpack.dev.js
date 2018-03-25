const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        hot: true,
        historyApiFallback: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});
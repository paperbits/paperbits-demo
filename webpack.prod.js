const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    plugins: [
        new webpack.DefinePlugin({	
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new UglifyJSPlugin({
            uglifyOptions: {
                ie8: false,
                ecma: 5,
                mangle: false,
                output: {
                    comments: false,
                    beautify: false
                }
            }
        })
    ]
});
const webpack = require("webpack");
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = merge(common, {
    mode: "production",
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                uglifyOptions: {
                    ie8: false,
                    ecma: 5,
                    mangle: false,
                    minify: {},
                    output: {
                        comments: false,
                        beautify: false
                    }
                }
            })
        ]
    },
    plugins: [
        new CleanWebpackPlugin(["dist"]),
        new webpack.DefinePlugin({	
            "process.env.NODE_ENV": JSON.stringify("production")
        })
    ]
});
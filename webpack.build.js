const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

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
    }
});
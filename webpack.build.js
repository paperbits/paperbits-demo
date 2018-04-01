const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    plugins: [
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
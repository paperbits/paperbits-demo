const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const TerserPlugin = require("terser-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");


module.exports = merge(common, {
    mode: "production",
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    sourceMap: false,
                    mangle: false,
                    output: {
                        comments: false,
                    }
                }
            })
        ]
    },
    plugins: [
        new CleanWebpackPlugin(["dist/designer"]),
        new CopyWebpackPlugin([
            { from: `./src/config.design.json`, to: `./config.json` }
        ]),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        })
    ]
});
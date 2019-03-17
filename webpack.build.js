const webpack = require("webpack");
const merge = require("webpack-merge");
const designConfig = require("./webpack.design.js");
const TerserPlugin = require("terser-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");


module.exports = merge(designConfig, {
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
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            { from: `./src/config.design.json`, to: `./config.json` }
        ]),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        })
    ]
});
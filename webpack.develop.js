const webpack = require("webpack");
const merge = require("webpack-merge");
const desigConfig = require("./webpack.design.js");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(desigConfig, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        hot: true,
        historyApiFallback: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin([
            { from: `./src/config.design.json`, to: `./config.json` }
        ])
    ]
});
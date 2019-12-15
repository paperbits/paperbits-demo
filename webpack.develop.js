const webpack = require("webpack");
const merge = require("webpack-merge");
const designerConfig = require("./webpack.designer.js");


module.exports = merge(designerConfig, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        hot: true,
        historyApiFallback: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});
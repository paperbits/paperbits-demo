const merge = require("webpack-merge");
const designerConfig = require("./webpack.designer.js");
const TerserPlugin = require("terser-webpack-plugin");


module.exports = merge(designerConfig, {
    mode: "production",
    optimization: {
        minimizer: [
            new TerserPlugin({
                sourceMap: false,
                terserOptions: {
                    mangle: false,
                    output: {
                        comments: false,
                    }
                }
            })
        ]
    }
});
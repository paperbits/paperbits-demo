const path = require("path");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");


const runtimeConfig = {
    mode: "none",
    target: "web",
    entry: {
        "scripts/theme": ["./src/startup.runtime.ts"],
    },
    output: {
        filename: "./[name].js",
        path: path.resolve(__dirname, "dist/runtime"),
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader", options: { url: false } },
                    { loader: "postcss-loader" },
                    { loader: "sass-loader" }
                ]
            },
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            {
                test: /\.html$/,
                loader: "html-loader",
                options: {
                    esModule: true,
                    minimize: {
                        removeComments: false,
                        collapseWhitespace: false
                    }
                }
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: "url-loader",
                options: {
                    limit: 10000
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.liquid$/,
                loader: "raw-loader"
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: "[name].css", chunkFilename: "[id].css" }),
        new CopyWebpackPlugin({
            patterns: [
                { from: `./src/config.runtime.json`, to: `config.json` },
                { from: `./src/themes/website/styles/fonts`, to: "styles/fonts" },
                { from: `./src/themes/website/assets` }
            ]
        })
    ],
    resolve: {
        alias: {
            "vue$": "vue/dist/vue.esm.js"
        },
        extensions: [".ts", ".tsx", ".js", ".jsx", ".html", ".scss"]
    }
}

module.exports = (designer) => {
    const modification = {
        entry: {},
        output: {}
    }

    if (designer) {
        modification.entry["styles/theme"] = `./src/themes/website/styles/styles.design.scss`;
        modification.output["path"] = path.resolve(__dirname, "dist/designer");
    }
    else {
        modification.entry["styles/theme"] = `./src/themes/website/styles/styles.scss`
        modification.output["path"] = path.resolve(__dirname, "dist/publisher/assets");
    }

    return merge(runtimeConfig, modification);
};
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const selectedTheme = "paperbits";

module.exports = {
    mode: "development",
    entry: {
        "scripts/theme.js": [`./src/themes/${selectedTheme}/scripts/index.ts`],
        "styles/theme": [`./src/themes/${selectedTheme}/styles/styles.scss`]
    },
    output: {
        filename: "./[name]",
        path: path.resolve(__dirname, "./dist/published/theme")
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader", options: { url: false, minimize: true, sourceMap: false } },
                    { loader: "postcss-loader", options: { sourceMap: false, options: { plugins: () => [autoprefixer] } } },
                    { loader: "sass-loader", options: { sourceMap: false } }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: "html-loader?exportAsEs6Default"
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new CopyWebpackPlugin([
            { from: `./src/themes/${selectedTheme}/styles/fonts`, to: "styles/fonts" }
        ])
    ],
    optimization: {
        concatenateModules: true //ModuleConcatenationPlugin
    },
    resolve: {
        extensions: [".tsx", ".ts", ".html", ".scss"]
    }
};
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const selectedTheme = "paperbits";

module.exports = {
    entry: {
        "scripts/paperbits": ["./src/startup.develop.ts"],
        "css/paperbits": ["./node_modules/@paperbits/knockout/styles/vienna.scss"],
        "theme/scripts/theme": [`./src/themes/${selectedTheme}/scripts/index.ts`],
        "theme/css/theme": [`./src/themes/${selectedTheme}/styles/styles.scss`]
    },
    output: {
        filename: "./[name].js",
        path: path.resolve(__dirname, "./dist/editors")
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader", options: { url: false, minimize: true, sourceMap: true } },
                    { loader: "postcss-loader", options: { sourceMap: true, options: { plugins: () => [autoprefixer] } } },
                    { loader: "sass-loader", options: { sourceMap: true } }
                ]
            },
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            {
                test: /\.html$/,
                loader: "html-loader?exportAsEs6Default"
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: "url-loader?limit=100000"
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(["dist"]),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new CopyWebpackPlugin([
            { from: "./node_modules/@paperbits/knockout/assets" },
            { from: "./node_modules/@paperbits/knockout/styles/fonts", to: "css/fonts" },
            { from: `./src/data`, to: "data" },
            { from: `./src/themes/${selectedTheme}/assets`, to: "theme" },
            { from: `./src/themes/${selectedTheme}/config.json` }
        ])
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".html", ".scss"]
    }
};
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const selectedTheme = "paperbits";
const editorTheme = "paperbits-editor";

module.exports = {
    entry: {
        "scripts/paperbits": ["./src/startup.develop.ts"],
        "styles/paperbits": [`./src/themes/${editorTheme}/styles/paperbits.scss`],
        "theme/scripts/theme": [`./src/themes/${selectedTheme}/scripts/index.ts`],
        "theme/styles/theme": [`./src/themes/${selectedTheme}/styles/styles.scss`]
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
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new CopyWebpackPlugin([
            { from: `./src/data`, to: "data" },
            { from: `./src/themes/${editorTheme}/assets`},
            { from: `./src/themes/${editorTheme}/styles/fonts`, to: "styles/fonts" },
            { from: `./src/themes/${selectedTheme}/assets`, to: "theme" },
            { from: `./src/themes/${selectedTheme}/styles/fonts`, to: "theme/styles/fonts" },
            { from: `./src/themes/${selectedTheme}/config.json` }
        ])
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".html", ".scss"]
    }
};
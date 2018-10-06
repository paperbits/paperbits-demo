const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const selectedTheme = "paperbits";

module.exports = {
    mode: "development",
    entry: {
        "website/scripts/theme.js": [`./src/themes/${selectedTheme}/scripts/index.ts`],
        "website/styles/theme": [`./src/themes/${selectedTheme}/styles/styles.scss`],
        "email-templates/theme": [`./src/themes/${selectedTheme}/styles/emails/emails.scss`]
    },
    output: {
        filename: "./[name]",
        path: path.resolve(__dirname, "./dist/published")
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
        new CopyWebpackPlugin([
            { from: `./src/themes/${selectedTheme}/styles/fonts`, to: "website/styles/fonts" },
            { from: `./src/themes/${selectedTheme}/assets/index.html`, to: "website"},
            { from: `./src/themes/${selectedTheme}/assets/email.html`, to: "email-templates"},
            { from: `./src/themes/${selectedTheme}/assets/search-index.json`, to: "website"},
        ]),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ],
    optimization: {
        concatenateModules: true
    },
    resolve: {
        extensions: [".tsx", ".ts", ".html", ".scss"]
    }
};
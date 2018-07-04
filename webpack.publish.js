const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const selectedTheme = "paperbits";
const editorTheme = "paperbits-editor";

module.exports = {
    mode: "development",
    target: 'node', 
    entry: {
        "publisher": ['./src/startup.publish.ts'],
        "styles/paperbits" : [`./src/themes/${editorTheme}/styles/paperbits.scss`],
        "theme/scripts/theme": [`./src/themes/${selectedTheme}/scripts/index.ts`],
        "theme/styles/theme" : [`./src/themes/${selectedTheme}/styles/styles.scss`]
    },
    output: {
        filename: './[name].js',
        path: path.resolve(__dirname, 'dist/dev'),
        library: 'paperbitsPublisher',	
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [ 
                    MiniCssExtractPlugin.loader, 
                    { loader: "css-loader", options: { url: false, minimize: true, sourceMap: true } },
                    { loader: 'postcss-loader', options: { sourceMap: true, options: { plugins: () => [autoprefixer] } } },
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
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new CopyWebpackPlugin([   
            { from: `./src/themes/${selectedTheme}/assets`, to: "theme"},
            { from: `./src/themes/${selectedTheme}/config.json`}  
        ])
    ],
    optimization: {
        concatenateModules: true //ModuleConcatenationPlugin
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", '.jsx', ".html", ".scss"] 
    }
};
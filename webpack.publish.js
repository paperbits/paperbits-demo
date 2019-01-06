const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",
    target: "node", 
    entry: {
        "publisher": ["./src/startup.publish.ts"],
        "publishFromFS": ["./src/publishFromFS.ts"]
    },
    output: {
        filename: "./[name].js",
        path: path.resolve(__dirname, "dist"),
        library: "paperbitsPublisher",	
        libraryTarget: "commonjs2"
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
            { from: `./src/config.json`}  
        ])
    ],
    optimization: {
        concatenateModules: true //ModuleConcatenationPlugin
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".html", ".scss"] 
    }
};
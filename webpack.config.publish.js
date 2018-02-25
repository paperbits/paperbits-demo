const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const selectedTheme = "paperbits";
// const selectedTheme = "hostmeapp";

const extractSass = new ExtractTextPlugin({
    filename: (resultPath) => {
        let path = resultPath('./[name].css');
        console.log("css path:" + path);
        return resultPath('./[name].css').replace("scripts", "css");
    },
    allChunks: true
});

module.exports = {
    target: 'node', 
    entry: {
        "publisher": ['./src/publisher.ts'],
        "theme/scripts/theme": [`./src/themes/${selectedTheme}/scripts/index.ts`, `./src/themes/${selectedTheme}/styles/styles.scss`]
    },
    output: {
        filename: './[name].js',
        path: path.resolve(__dirname, 'dist/dev'),
        library: 'paperbitsPublisher',	
        libraryTarget: 'commonjs2'
    },
    devtool: 'source-map',
    module: {
        rules: [
            { // sass / scss loader for webpack
                test: /\.scss$/,
                use: extractSass.extract({        
                    use: [
                        { loader: "css-loader", options: { url: false, minimize: true, sourceMap: true } },
                        { loader: 'postcss-loader', options: { sourceMap: true, options: { plugins: () => [autoprefixer] } } },
                        { loader: "sass-loader", options: { sourceMap: true } }
                    ],
                    fallback: "style-loader"
                }),
                //exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.json'
                },
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                //exclude: /node_modules/,
                loader: "html-loader?exportAsEs6Default"
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    plugins: [
        extractSass,      
        /**
         * Plugin: CopyWebpackPlugin
         * Description: Copy files and directories in webpack.
         *
         * Copies project static assets.
         *
         * See: https://www.npmjs.com/package/copy-webpack-plugin
         */
        new CopyWebpackPlugin([   
            { from: `./src/themes/${selectedTheme}/assets`, to: "theme"},
            { from: `./src/themes/${selectedTheme}/config.publishing.json`}  
        ]),
        // new webpack.DefinePlugin({	
        //     'process.env': {	
        //       'NODE_ENV': JSON.stringify('production'),	
        //     }	
        // })
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", '.jsx', ".html", ".scss"] 
    }
};
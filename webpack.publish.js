const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const selectedTheme = "paperbits";

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
        "publisher": ['./src/startup.publish.ts'],
        "theme/scripts/theme": [`./src/themes/${selectedTheme}/scripts/index.ts`, `./src/themes/${selectedTheme}/styles/styles.scss`]
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
                use: extractSass.extract({        
                    use: [
                        { loader: "css-loader", options: { url: false, minimize: true, sourceMap: false } },
                        { loader: 'postcss-loader', options: { sourceMap: false, options: { plugins: () => [autoprefixer] } } },
                        { loader: "sass-loader", options: { sourceMap: false } }
                    ],
                    fallback: "style-loader"
                })
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
        new webpack.DefinePlugin({	
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        extractSass,
        new CopyWebpackPlugin([   
            { from: `./src/themes/${selectedTheme}/assets`, to: "theme"},
            { from: `./src/themes/${selectedTheme}/config.json`}  
        ])
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", '.jsx', ".html", ".scss"] 
    }
};
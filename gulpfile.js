const gulp = require("gulp");
const gutil = require('gulp-util');
const merge = require("merge2");
const del = require("del");
const runSeq = require("run-sequence").use(gulp);
const webpack = require('webpack');
const webpackDevServer = require("webpack-dev-server");

gulp.task("clean",() => {
    return del(["dist/**"]);
});

gulp.task("webpack-dev",["clean"], (callback) => {
    var webPackConfig = require("./webpack.config.dev.js");
    webpack(webPackConfig, function(err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        
        gutil.log('[webpack-dev]', stats.toString({        
            colors: true,        
            progress: true        
        }));
    
        callback();        
    });
});

gulp.task('server', ["webpack-dev"], () => { 
    const webPackConfig = require("./webpack.config.dev.js");
    const options = {
        host: "0.0.0.0",
        contentBase: './dist',
        hot: true
    };
    webpackDevServer.addDevServerEntrypoints(webPackConfig, options);
    const compiler = webpack(webPackConfig);
    const server = new webpackDevServer(compiler, options);
    server.listen(8080, 'localhost', function(err) {    
        if(err) throw new gutil.PluginError('webpack-dev-server', err);
        gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
    });
});

gulp.task("default", ["webpack-dev"]);
const gulp = require("gulp");
const gutil = require("gulp-util");
const merge = require("merge2");
const del = require("del");
const runSeq = require("run-sequence").use(gulp);
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");

gulp.task("clean", ()  => {
        return  del(["dist/**"]);
});

gulp.task("webpack-dev", ["clean"], (callback) => {
    var webPackConfig = require("./webpack.config.dev.js");
    webpack(webPackConfig, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);

        gutil.log("[webpack-dev]", stats.toString({
            colors: true,
            progress: true
        }));

        callback();
    });
});

gulp.task("webpack-publish", ["clean"], (callback) => {
    var webPackConfig = require("./webpack.config.publish.js");
    webpack(webPackConfig, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);

        gutil.log("[webpack-publish]", stats.toString({
            colors: true,
            progress: true
        }));

        callback();
    });
});

gulp.task("server", ["webpack-dev"], () => {
    const webPackConfig = require("./webpack.config.dev.js");
    const options = {
        host: "0.0.0.0",
        contentBase: "./dist/dev",
        hot: true
    };
    webpackDevServer.addDevServerEntrypoints(webPackConfig, options);
    const compiler = webpack(webPackConfig);
    const server = new webpackDevServer(compiler, options);
    server.listen(8080, "localhost", function (err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    });
});


gulp.task("publish", ["webpack-publish"], () => {
    const pub = require("./dist/dev/publisher.js");
    const inputBasePath = "./dist/dev/theme";
    const outputBasePath = "./dist/published";
    const indexFilePath = "./dist/dev/theme/index.html";
    const settingsConfigPath = "./dist/dev/config.publishing.json";

    gulp.src([`${inputBasePath}/**/*.*`, `!${indexFilePath}`]).pipe(gulp.dest(`${outputBasePath}/theme`));

    const publisher = new pub.Publisher(inputBasePath, outputBasePath, indexFilePath, settingsConfigPath);
    const publishPromise = publisher.publish();

    publishPromise.then((result) => {
        console.log("DONE");
        process.exit();
    });

    publishPromise.catch((error) => {
        console.log(error);
        process.exit();
    });
});

gulp.task("default", ["webpack-dev"]);
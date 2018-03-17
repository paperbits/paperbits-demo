const gulp = require("gulp");
const gutil = require("gulp-util");
const webpack = require("webpack");

gulp.task("webpack-publish", (callback) => {
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


gulp.task("publish", ["webpack-publish"], () => {
    const pub = require("./dist/dev/publisher.js");
    const inputBasePath = "./dist/dev/theme";
    const outputBasePath = "./dist/published";
    const indexFilePath = "./dist/dev/theme/index.html";
    const settingsConfigPath = "./dist/dev/config.json";

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
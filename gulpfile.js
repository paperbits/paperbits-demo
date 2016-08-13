var gulp = require("gulp");
var less = require("gulp-less");
var autoprefixer = require('gulp-autoprefixer');
var bower = require("main-bower-files");
var concat = require("gulp-concat");
var webserver = require("gulp-webserver");
var uglify = require("gulp-uglify");

function handleErrors(error) {
    console.log('ERROR');
    console.log(error.toString());
    this.emit("end");
}

gulp.task("serve", ["build", "watch"], function () {
    return gulp.src("public")
        .pipe(webserver({
            port: "80",
            livereload: true,
            fallback: 'index.html',
            open: false
        }));
});

gulp.task("theme", function () {
    return gulp.src([
        "src/favicon.ico",
        "src/fonts/**/*.*",
        "src/images/**/*.*",
        "src/*.html",
        "src/**/*.json"],
        { base: 'src/' })
        .pipe(gulp.dest("public"));
});

gulp.task("theme-styles", function () {
    return gulp.src("src/styles/styles.less")
        .pipe(less())
        .pipe(autoprefixer())
        .on("error", handleErrors)
        .pipe(concat("styles.min.css"))
        .pipe(gulp.dest("public/styles"));
});

gulp.task("build", ["theme", "theme-styles"]);

gulp.task("watch", function () {
    gulp.watch(["src/**/*.*"], ["theme", "theme-styles"]).on("error", handleErrors);
});

gulp.task("default", ["build", "watch"]);

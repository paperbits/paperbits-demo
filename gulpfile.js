var gulp = require("gulp");
var less = require("gulp-less");
var autoprefixer = require('gulp-autoprefixer');
var bower = require("main-bower-files");
var concat = require("gulp-concat");
var webserver = require("gulp-webserver");
var uglify = require("gulp-uglify");
var filter = require("gulp-filter");
var typescript = require("typescript");
var typescriptCompiler = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");

function handleErrors(error) {
    console.log('ERROR');
    console.log(error.toString());
    this.emit("end");
}

gulp.task("styles", function () {
    return gulp.src("src/styles/vienna.less")
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .on("error", handleErrors)
        .pipe(gulp.dest("public/styles"));
});

gulp.task("fonts", function () {
    return gulp.src("src/styles/fonts/**/*.*")
        .pipe(gulp.dest("public/styles/fonts"));
});

gulp.task("typescript", function () {
    var tsProject = typescriptCompiler.createProject('tsconfig.json', {
        sortOutput: true,
        typescript: typescript
    });

    var tsResult = tsProject
        .src()
        .pipe(sourcemaps.init())
        .pipe(typescriptCompiler(tsProject));

    return tsResult.js
        .pipe(concat('vienna.js'))
        .pipe(uglify({ mangle: false }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/scripts'));
});

gulp.task("templates", function () {
    return gulp.src(["src/app.ko/**/*.html"])
        .pipe(gulp.dest("public/scripts/templates"));
});

gulp.task("vendor-scripts", function () {
    var files = bower();
    var jsFilesFilter = filter("**/*.js", { restore: true });

    files.push("src/other_components/*.js");

    return gulp.src(files)
        .pipe(jsFilesFilter)
        .pipe(concat("vendor.js"))
        //.pipe(uglify())
        .pipe(gulp.dest("public/scripts"));
});

gulp.task("serve", ["build", "build-theme", "watch"], function () {
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
        "src/theme/fonts/**/*.*",
        "src/theme/images/**/*.*",
        "src/theme/*.html",
        "src/theme/**/*.json"],
        { base: 'src/theme/' })
        .pipe(gulp.dest("public"));
});

gulp.task("theme-styles", function () {
    return gulp.src("src/theme/styles/styles.less")
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .on("error", handleErrors)
        .pipe(concat("theme.css"))
        .pipe(gulp.dest("public/styles"));
});

gulp.task("build", ["styles", "fonts", "typescript", "templates", "vendor-scripts"]);
gulp.task("build-theme", ["theme", "theme-styles"]);

gulp.task("watch", function () {
    gulp.watch(["src/**/*.less"], ["styles"]).on("error", handleErrors);
    gulp.watch(["src/**/*.ts"], ["typescript"]).on("error", handleErrors);
    gulp.watch(["src/**/*.html"], ["templates"]).on("error", handleErrors);
    gulp.watch(["src/theme/**/*.*"], ["theme", "theme-styles"]).on("error", handleErrors);
});

gulp.task("default", ["build", "build-theme", "watch"]);
gulp.task("build-all", ["build", "build-theme"]);
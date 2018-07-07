const gulp = require("gulp");

gulp.task("publish", () => {
    const pub = require("./dist/dev/publisher.js");
    const inputBasePath = "./dist/dev/theme";
    const outputBasePath = "./dist/published";
    const indexFilePath = "./dist/dev/theme/index.html";
    const settingsConfigPath = "./dist/dev/config.json";
    const demoDataPath = "./src/data/demo.json";
    
    gulp.src([`${inputBasePath}/**/*.*`, `!${indexFilePath}`]).pipe(gulp.dest(`${outputBasePath}/theme`));

    const publisher = new pub.Publisher(inputBasePath, outputBasePath, indexFilePath, settingsConfigPath, demoDataPath);
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
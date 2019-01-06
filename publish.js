const publisher = require("./dist/publisher.js");
const runner = require("./dist/publishFromFS.js");

const inputBasePath = "./dist";
const outputBasePath = "./dist/published";
const configPath = "./dist/config.json";
const demoDataPath = "./src/data/demo.json";

const fsPublisher = new runner.PublishFromFS(inputBasePath, outputBasePath, configPath, demoDataPath);

fsPublisher.run(publisher).then(() => {
    console.log("done");
    process.exit();
}).catch((err) => {
    console.log(err);
    process.exit();
});
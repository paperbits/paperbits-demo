const pub = require("./dist/publisher.js");
const inputBasePath = "./dist/published/website";
const outputBasePath = "./dist/published";
const settingsConfigPath = "./dist/config.json";
const demoDataPath = "./src/data/demo.json";
const pageTemplatePath =  "./dist/published/website/page.html";

const publisher = new pub.Publisher(inputBasePath, outputBasePath, pageTemplatePath, settingsConfigPath, demoDataPath);
publisher.publish().then(() => process.exit());
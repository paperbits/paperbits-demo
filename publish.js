const pub = require("./dist/publisher.js");
const inputBasePath = "./dist/published/website";
const outputBasePath = "./dist/published";
const settingsConfigPath = "./dist/config.json";
const demoDataPath = "./src/data/demo.json";
const pageTemplatePath =  "./dist/published/website/index.html";
const emailTemplatePath = "./dist/published/email-templates/email.html";

const publisher = new pub.Publisher(inputBasePath, outputBasePath, pageTemplatePath, emailTemplatePath, settingsConfigPath, demoDataPath);
publisher.publish().then(() => process.exit());
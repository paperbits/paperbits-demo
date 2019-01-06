import * as fs from "fs";
import { FileSystemBlobStorage } from "./components/fileSystemBlobStorage";

export class PublishFromFS {
    private sourceStorage: FileSystemBlobStorage;
    private publishStorage: FileSystemBlobStorage;
    
    constructor(
            sourceBasePath: string, 
            outBasePath: string, 
            private readonly configPath: string, 
            private readonly demoDataPath: string) {

        this.sourceStorage = new FileSystemBlobStorage(`${sourceBasePath}/website/`);
        this.publishStorage = new FileSystemBlobStorage(outBasePath);
    }

    public async run(publishModule): Promise<void> {
        const publishConfig = fs.readFileSync(this.configPath, "utf8").toString();
        const publisher = new publishModule.Publisher(JSON.parse(publishConfig), this.demoDataPath);

        console.log("start publishing ...");

        await publisher.publish(this.sourceStorage, this.publishStorage);
    }
}

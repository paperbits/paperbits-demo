import { IPublisher } from "@paperbits/common/publishing";
import { IBlobStorage } from "@paperbits/common/persistence";

export class AssetPublisher implements IPublisher {
    private readonly inputBlobStorage: IBlobStorage;
    private readonly outputBlobStorage: IBlobStorage;
    private readonly assetsBasePath: string;

    constructor(inputBlobStorage: IBlobStorage, outputBlobStorage: IBlobStorage, assetsBasePath: string) {
        this.inputBlobStorage = inputBlobStorage;
        this.outputBlobStorage = outputBlobStorage;
        this.assetsBasePath = assetsBasePath;
    }

    private async copyAssetFrom(assetPath: string): Promise<void> {
        const copyFrom = assetPath;
        const cutOut = `/${this.assetsBasePath}/`;
        const copyTo = copyFrom.replace(cutOut, "");
        const byteArray = await this.inputBlobStorage.downloadBlob(copyFrom);

        console.log(`Publishing "${copyFrom}" to "${copyTo}"...`);

        await this.outputBlobStorage.uploadBlob(`website\\${copyTo}`, byteArray);
    }

    private async copyAssets(): Promise<void> {
        const copyPromises = new Array<Promise<void>>();
        const assetPaths = await this.inputBlobStorage.listBlobs();

        assetPaths.forEach((assetPath) => {
            if (assetPath.startsWith(`/${this.assetsBasePath}/`)) {
                copyPromises.push(this.copyAssetFrom(assetPath));
            }
        });

        await Promise.all(copyPromises);
    }

    public async publish(): Promise<void> {
        await this.copyAssets();
    }
}
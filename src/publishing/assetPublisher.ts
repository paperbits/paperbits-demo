import { IPublisher } from "@paperbits/common/publishing";
import { IBlobStorage } from "@paperbits/common/persistence";

export class AssetPublisher implements IPublisher {
    private readonly inputBlobStorage: IBlobStorage;
    private readonly outputBlobStorage: IBlobStorage;

    constructor(inputBlobStorage: IBlobStorage, outputBlobStorage: IBlobStorage) {
        this.inputBlobStorage = inputBlobStorage;
        this.outputBlobStorage = outputBlobStorage;
    }

    private async copyAssetFrom(assetPath: string): Promise<void> {
        try {
            const byteArray = await this.inputBlobStorage.downloadBlob(assetPath);            
            await this.outputBlobStorage.uploadBlob(assetPath, byteArray);
        } catch (error) {
            console.log(assetPath + " assets error:" + error);            
        }
    }

    private async copyAssets(): Promise<void> {
        const assetPaths = await this.inputBlobStorage.listBlobs();
        if (assetPaths.length > 0) {
            const copyPromises = assetPaths.map(assetPath => this.copyAssetFrom(assetPath));
            await Promise.all(copyPromises);
        }
    }

    public async publish(): Promise<void> {
        await this.copyAssets();
    }
}
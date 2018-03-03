import * as Utils from "@paperbits/common/utils";
import { OfflineObjectStorage } from "@paperbits/common/persistence/offlineObjectStorage";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IBlobStorage } from '@paperbits/common/persistence/IBlobStorage';
import { ProgressPromise } from '@paperbits/common/progressPromise';


export class StaticBlobStorage implements IBlobStorage {
    private storageDataObject = {};

    public async uploadBlob(blobKey: string, content: Uint8Array, contentType?: string): ProgressPromise<void> {
        return new ProgressPromise<void>((resolve, reject, progress) => {
            const base64String = Utils.arrayBufferToBase64(content);

            this.storageDataObject[blobKey] = `data:${contentType};base64,${base64String}`;

            resolve();
        });
    }

    public async getDownloadUrl(fileName: string): Promise<string> {
        const downloadUrl = this.storageDataObject[fileName];

        if (downloadUrl) {
            return downloadUrl;
        }
        else {
            throw "file not found";
        }
    }

    public async deleteBlob(fileName: string): Promise<void> {
        delete this.storageDataObject[fileName];
    }
}


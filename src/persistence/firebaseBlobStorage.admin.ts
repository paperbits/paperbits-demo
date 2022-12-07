import { HttpClient } from "@paperbits/common/http";
import { IBlobStorage } from "@paperbits/common/persistence";
import { FirebaseService } from "../services/firebaseService.admin";
import * as Utils from "@paperbits/common/utils";

export class FirebaseBlobStorage implements IBlobStorage {
    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly httpClient: HttpClient
    ) { }

    public async uploadBlob(name: string, content: Uint8Array, contentType?: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            const storageRef = await this.firebaseService.getStorageRef();

            await storageRef.file(name).save(Buffer.from(content.buffer), {
                metadata: {
                    contentType: contentType
                }
            });
        });
    }

    public async downloadBlob?(blobKey: string): Promise<Uint8Array> {
        const downloadUrl = await this.getDownloadUrl(blobKey);

        if (!downloadUrl) {
            return null;
        }

        const response = await this.httpClient.send({ url: downloadUrl });

        if (response?.statusCode === 200) {
            return response.toByteArray();
        }

        return null;
    }

    public async getDownloadUrl(blobKey: string): Promise<string> {
        const storageRef = await this.firebaseService.getStorageRef();

        let key = this.firebaseService.storageBasePath;

        if (key.endsWith("/")) {
            key = key.slice(0, key.length - 1);
        }

        key += Utils.ensureLeadingSlash(blobKey);

        if (key.startsWith("/")) {
            key = key.substring(1);
        }

        const file = storageRef.file(key);
        const downloadUrls = await file.getSignedUrl({ action: "read", expires: "01-01-2100" });

        if (downloadUrls.length > 0) {
            return downloadUrls[0];
        }

        return null;
    }

    public async deleteBlob(filename: string): Promise<void> {
        const storageRef = await this.firebaseService.getStorageRef();

        await storageRef.file(filename).delete();
    }
}
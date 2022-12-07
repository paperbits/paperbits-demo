import { HttpClient } from "@paperbits/common/http";
import { IBlobStorage } from "@paperbits/common/persistence";
import { FirebaseService } from "../services/firebaseService";


export class FirebaseBlobStorage implements IBlobStorage {
    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly httpClient: HttpClient
    ) { }

    public uploadBlob(name: string, content: Uint8Array, contentType?: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            const storageRef = await this.firebaseService.getStorageRef();
            const metaData = contentType ? { contentType: contentType } : null;
            const uploadTask = storageRef.child(name).put(content, metaData);

            uploadTask.on("state_changed",
                (snapshot: any) => {
                    // progress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                },
                (error: Error) => {
                    console.error(error);
                    reject();
                },
                resolve);
        });
    }

    public async downloadBlob(blobKey: string): Promise<Uint8Array> {
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
        if (!blobKey) {
            throw new Error(`Parameter "blobKey" not specified.`);
        }

        const storageRef = await this.firebaseService.getStorageRef();

        try {
            const downloadUrl = await storageRef.child(blobKey).getDownloadURL();
            return downloadUrl;
        }
        catch (error) {
            if (error && error.code_ === "storage/object-not-found") {
                return null;
            }
            throw error;
        }
    }

    public async deleteBlob(filename: string): Promise<void> {
        const storageRef = await this.firebaseService.getStorageRef();

        await storageRef.child(filename).delete();
    }
}
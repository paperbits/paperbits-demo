module Vienna.Persistence {
    export interface IFileStorage {
        uploadFile(file: File): ProgressPromise<void>;
        getDownloadUrl(permalink: string): Promise<string>;
        deleteFile(uri: string): Promise<void>;
    }
}

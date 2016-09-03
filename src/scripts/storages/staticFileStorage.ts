module Paperbits.Storages {
    export class StaticFileStorage implements Paperbits.Persistence.IFileStorage {
        private storageDataObject = {};

        public uploadFile(name: string, file: Blob): ProgressPromise<void> {
            return new ProgressPromise<void>((resolve, reject, progress) => {
                Utils.readFileAsDataUrl(file).then(url => {
                    this.storageDataObject[name] = url;
                    resolve();
                }, null, progress);
            });
        }

        public getDownloadUrl(fileName: string): Promise<string> {
            let downloadUrl = this.storageDataObject[fileName];
            if(downloadUrl) {
                return Promise.resolve<string>(downloadUrl);
            } else {
                return Promise.reject("file not found");
            }

        }

        public deleteFile(fileName: string): Promise<void> {
            delete this.storageDataObject[fileName];
            return Promise.resolve<void>();
        }
    }
}

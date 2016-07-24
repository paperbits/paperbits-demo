module Vienna.Data {
    export class StaticFileStorage implements Vienna.Persistence.IFileStorage {
        private storageDataObject = {};

        private readFileAsDataUrl(file: File): ProgressPromise<string> {
            return new ProgressPromise<string>((resolve, reject, progress) => {
                let reader = new FileReader();
                reader.onload = (event: any) => {
                    let dataUrl = event.target.result;
                    resolve(dataUrl);
                };
                reader.onprogress = (progressEvent: ProgressEvent) => {
                    if (progressEvent.lengthComputable) {
                        let percentLoaded = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        progress(percentLoaded);
                    }
                };

                reader.readAsDataURL(file);
            });
        }

        public uploadFile(file: File): ProgressPromise<void> {
            return new ProgressPromise<void>((resolve, reject, progress) => {
                this.readFileAsDataUrl(file).progress(progress).then(downloadUrl => {
                    this.storageDataObject[file.name] = downloadUrl;
                    resolve();
                });
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

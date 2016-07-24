module Vienna.Data {
    import IObjectStorage = Vienna.Persistence.IObjectStorage;
    import IFileStorage = Vienna.Persistence.IFileStorage;

    export class MediaService implements IMediaService {
        private objectStorage: Persistence.IObjectStorage;
        private fileStorage: IFileStorage;

        constructor(objectStorage: IObjectStorage, fileStorage: IFileStorage) {
            this.objectStorage = objectStorage;
            this.fileStorage = fileStorage;
        }

        private searchByTags(tags: Array<string>, tagValue: string, startSearch: boolean): Promise<Array<IMedia>> {
            return this.objectStorage.searchObjects<IMedia>(StorageType[StorageType.uploads], tags, tagValue, startSearch);
        }

        public getByPermalink(permalink: string): Promise<IMedia> {
            return this.objectStorage
                .searchObjects<IMedia>(StorageType[StorageType.permalinks], null, permalink)
                .then((files: Array<IMedia>) => {
                    if (files && files.length) {
                        return files[0];
                    }
                });
        }

        public getMediaByKey(key: string): Promise<IMedia> {
            return this.objectStorage.getObject<IMedia>(key);
        }

        public search(pattern: string): Promise<Array<IMedia>> {
            return this.searchByTags(["title"], pattern, true); //TODO: take type into account
        }

        public deleteMedia(mediaFile: IMedia): Promise<void> {
            return this.fileStorage.deleteFile(mediaFile.filename).then((result) => {
                return this.objectStorage.deleteObject(mediaFile.key);
            });
        }

        public createMedia(file: File): ProgressPromise<IMedia> {
            return new ProgressPromise<IMedia>((resolve, reject, progress) => {
                this.fileStorage.uploadFile(file).progress(progress).then(() => {
                    this.fileStorage.getDownloadUrl(file.name).then((uri: string) => {
                        var mediaId = "{0}/{1}".format(StorageType.uploads, Utils.guid());
                        var permalinkId = "{0}/{1}".format(StorageType.permalinks, Utils.guid());

                        var media: IMedia = {
                            key: mediaId,
                            filename: file.name,
                            description: "",
                            keywords: "",
                            mimeType: file.type,
                            size: file.size,
                            downloadUrl: uri,
                            permalinkKey: permalinkId
                        };
                        var permalink: IPermalink = {
                            key: permalinkId,
                            targetKey: mediaId,
                            uri: `/content/${file.name}`
                        };

                        Promise.all([this.objectStorage.addObject(mediaId, media), this.objectStorage.addObject(permalinkId, permalink)]).then(() => {
                            resolve(media);
                        });
                    });
                });
            });
        }

        public updateMedia(media: IMedia): Promise<void> {
            return this.objectStorage.updateObject(media.key, media);
        }

        public uploadFromUrl(url: string): ProgressPromise<IMedia> {
            return new ProgressPromise<IMedia>((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                xhr.responseType = "blob";
                xhr.onload = () => {
                    var reader = new FileReader();
                    reader.onload = (event: any) => {
                        var parser = document.createElement("a");
                        parser.href = url.toLowerCase();
                        var fileName = parser.pathname.substr(parser.pathname.lastIndexOf('/') + 1);

                        var content: IFile = {
                            key: "",
                            mimeType: xhr.getResponseHeader("content-type"),
                            size: <any>xhr.getResponseHeader("content-length") * 1,
                            content: event.target.result
                        };

                        var mediaFile: IMedia = {
                            key: null,
                            filename: fileName,
                            description: fileName,
                            keywords: fileName,
                            mimeType: content.mimeType,
                            size: content.size
                        };
                    };
                    reader.readAsDataURL(xhr.response);
                };
                xhr.open('GET', url);
                xhr.send();
            });
        }
    }
}
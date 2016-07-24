module Vienna.Data {
    export class SiteService implements ISiteService {
        private objectStorage: Persistence.IObjectStorage;

        constructor(objectStorage: Persistence.IObjectStorage) {
            this.objectStorage = objectStorage;
        }

        public setTitle(title: string): Promise<void> {
            return this.objectStorage.updateObject(StorageType[StorageType.settings], {"title" : title});
        }

        public setKeywords(keywords: string) : Promise<void> {
            return this.objectStorage.updateObject(StorageType[StorageType.settings], {"keywords" : keywords});
        }

        public setDescription(description: string) : Promise<void> {
            return this.objectStorage.updateObject(StorageType[StorageType.settings], {"description" : description});
        }

        public setFavicon(media: IMedia) : Promise<void> {
            return this.objectStorage.updateObject(StorageType[StorageType.settings], {"iconPermalinkKey" : media.permalinkKey});
        }

        public getSiteSettings(): Promise<ISiteSettings> {
            return this.objectStorage.getObject<ISiteSettings>(StorageType[StorageType.settings]);
        }
    }
}
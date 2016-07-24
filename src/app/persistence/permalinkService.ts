module Vienna.Data {
    import IPermalinkService = Vienna.IPermalinkService;
    import IObjectStorage = Vienna.Persistence.IObjectStorage;
    import IPermalink = Vienna.Data.IPermalink;

    export class PermalinkService implements IPermalinkService {
        private objectStorage: IObjectStorage;

        constructor(objectStorage: IObjectStorage) {
            this.objectStorage = objectStorage;
        }

        public isPermalinkUrl(url: string): boolean {
            return !url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("data:");
        }

        public isPermalinkExists(permalink: string): Promise<IPermalink> {
            return this.objectStorage.searchObjects<IPermalink>(StorageType[StorageType.permalinks], null, permalink, false, true)
                .then((link: any) => {
                    return link;
                });
        }

        public getPermalink(permalink: string): Promise<IPermalink> {
            return this.objectStorage.getObject(permalink)
                .then((link: IPermalink) => {
                    return link;
                });
        }

        public getPermalinkByUrl(uri: string): Promise<IPermalink> {
            return new Promise<IPermalink>((resolve, reject) => {
                return this.objectStorage
                    .searchObjects<IPermalink>(StorageType[StorageType.permalinks], ["uri"], uri)
                    .then((permalinks: Array<IPermalink>) => {
                        if (permalinks.length > 0) {
                            resolve(permalinks[0]);
                        }
                        else {
                            throw new Error("Could not find resource by URI {0}.".format(uri));
                            resolve(/* special permalink pointing to 404 page */);
                        }
                    });
            });
        }

        public getPermalinkByKey(permalinkKey: string): Promise<IPermalink> {
            return this.objectStorage.getObject(permalinkKey).then((permalink: IPermalink) => {
                return permalink;
            });
        }

        public createPermalink(uri: string, objectLocation: string): Promise<IPermalink> {
            let permalinkId = StorageType.permalinks + "/" + Utils.guid();

            let permalink: IPermalink = {
                key: permalinkId,
                targetKey: objectLocation,
                uri: uri
            };

            return new Promise<IPermalink>((resolve, reject) => {
                this.objectStorage.addObject(permalinkId, permalink).then(() => {
                    resolve(permalink);
                });
            });
        }

        public updatePermalink(permalink: IPermalink): Promise<void> {
            return this.objectStorage.updateObject(permalink.key, permalink);
        }
    }
}
module Vienna.Data {
    import IPermalink = Vienna.Data.IPermalink;
    
    export enum StorageType {
        permalinks = <any>"permalinks",
        pages = <any>"pages",
        uploads = <any>"uploads",
        layouts = <any>"layouts",
        files = <any>"files",
        navigationItems = <any>"navigationItems",
        settings = <any>"settings"
    }

    export enum MimeType {
        html = <any>"text/html",
        png = <any>"image/png"
    }

    export interface IContentObject {
        key?: string;
        contentKey?: string;
        permalinkKey?: string;
    }

    export interface IContentStorageService {
        createPermalinkContentObject<T extends IPermalink>(path: StorageType, content: IFile, data: T): Promise<IPermalinkContentObject<T>>;
        createContentObject<T>(path: StorageType, content: IFile, data: T): any;
        getContentByPermalink(permalinkUrl: string): Promise<string>;
        getContent(contentUrl: string): Promise<string>;
    }

    export interface IPermalinkContentObject<T> {
        permalink: IPermalink;
        contentObject: IContentObject;
        content: T;
    }

    export class ContentStorageService implements IContentStorageService {
        private static AbsoluteUrlRegex = /\w+:/;

        constructor(private objectStorage: Persistence.IObjectStorage) {
        }

        public createPermalinkContentObject<T extends IPermalink>(path: StorageType, content: IFile, data: T): Promise<IPermalinkContentObject<T>> {
            let permalinkId = Utils.guid();
            let objectId = Utils.guid();
            let contentId = Utils.guid();

            let permalinkKey = StorageType.permalinks + "/" + permalinkId;
            let itemLocation = path + "/" + objectId;
            let contentKey = StorageType.files + "/" + contentId;

            let contentObj: IFile = {
                key: contentId,
                mimeType: content.mimeType,
                size: content.size,
                content: content.content
            };
            let permalinkObj: IPermalink = {
                key: permalinkId,
                targetKey: itemLocation,
                uri: data.uri
            };
            let itemObj: IContentObject = _.extend({
                objectId: objectId,
                contentKey: contentKey,
                permalinkKey: permalinkKey
            }, data);

            var storageObject = {};
            storageObject[permalinkKey] = permalinkObj;
            storageObject[itemLocation] = itemObj;
            storageObject[contentKey] = contentObj;

            return this.objectStorage.addObject(null, storageObject).then(result => <IPermalinkContentObject<T>>{
                permalink: permalinkObj,
                contentObject: contentObj,
                content: <T>itemObj,
            });
        }

        public createContentObject<T>(path: StorageType, content: IFile, data: T): any {
            let objectId = Utils.guid();
            let contentId = Utils.guid();

            let itemLocation = path + "/" + objectId;
            let contentKey = StorageType.files + "/" + contentId;

            let contentObj: IFile = { key: contentId, mimeType: content.mimeType, size: content.size, content: content.content };
            let itemObj: IContentObject = _.extend(data, { objectId: objectId, contentKey: contentKey });

            var storageObject = {};
            storageObject[itemLocation] = itemObj;
            storageObject[contentKey] = contentObj;

            return storageObject;
        }

        public getContentByPermalink(permalinkUrl: string): Promise<string> {
            if (ContentStorageService.AbsoluteUrlRegex.test(permalinkUrl)) {
                return Promise.resolve(permalinkUrl);
            } else {
                return this.objectStorage.getObject<IPermalink>(permalinkUrl).then(permalink => {
                    if (ContentStorageService.AbsoluteUrlRegex.test(permalink.targetKey)) {
                        return permalink.targetKey;
                    } else {
                        return this.objectStorage.getObject<IContentObject>(permalink.targetKey).then(contentObject => {
                            return this.objectStorage.getObject<IFile>(contentObject.contentKey).then(content => content.content);
                        });
                    }
                });
            }
        }

        public getContent(contentKey: string): Promise<string> {
            if (ContentStorageService.AbsoluteUrlRegex.test(contentKey)) {
                Promise.resolve(contentKey);
            } else {
                return this.objectStorage.getObject<IFile>(contentKey).then(content => content.content);
            }
        }
    }
}
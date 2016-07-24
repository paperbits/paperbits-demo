module Vienna.Data {
    import IFileReference = Vienna.Persistence.IFileReference;
    import IPermalink = Vienna.Data.IPermalink;

    export class PageService implements IPageService {
        private objectStorage: Persistence.IObjectStorage;
        private permalinkService: PermalinkService;

        constructor(objectStorage: Persistence.IObjectStorage, permalinkService: PermalinkService) {
            this.objectStorage = objectStorage;
            this.permalinkService = permalinkService;
        }

        private searchByTags(tags: Array<string>, tagValue: string, startAtSearch: boolean): Promise<Array<IPage>> {
            return this.objectStorage.searchObjects<IPage>(StorageType[StorageType.pages], tags, tagValue, startAtSearch).then((pages: Array<IPage>) => {
                return pages;
            });
        }

        public getPageByKey(key: string): Promise<IPage> {
            return this.objectStorage.getObject(key);
        }

        public getPageContentByKey(key: string): Promise<IFile> {
            return this.objectStorage.getObject<IFile>(key);
        }

        public createPageContent(html: string): Promise<IFile> {
            var key = "{0}/{1}".format(StorageType.files, Utils.guid());

            var content: IFile = {
                key: key,
                mimeType: MimeType[MimeType.html],
                size: html.length,
                content: html
            };

            return new Promise<IFile>((resolve, reject) => {
                this.objectStorage.addObject(key, content).then(() => {
                    resolve(content);
                });
            });
        }

        public updatePageContent(content: IFile): Promise<void> {
            return this.objectStorage.updateObject(content.key, content);
        }

        public search(pattern: string): Promise<Array<IPage>> {
            return this.searchByTags(["title"], pattern, true);
        }

        public deletePage(page: IPage): Promise<void> {
            var deleteContentPromise = this.objectStorage.deleteObject(page.contentKey);
            var deletePermalinkPromise = this.objectStorage.deleteObject(page.permalinkKey);
            var deletePagePromise = this.objectStorage.deleteObject(page.key);

            return Promise.all([deleteContentPromise, deletePermalinkPromise, deletePagePromise]).then(() => { return; });
        }

        public createPage(title: string, description: string, keywords): Promise<IPage> {
            var pageId = "{0}/{1}".format(StorageType.pages, Utils.guid());

            var page: IPage = {
                key: pageId,
                title: title,
                description: description,
                keywords: keywords,
            };

            return new Promise<IPage>((resolve, reject) => {
                this.objectStorage.addObject(pageId, page).then(() => {
                    resolve(page);
                });
            });
        }

        public updatePage(page: IPage): Promise<void> {
            return this.objectStorage.updateObject<IPage>(page.key, page);
        }

        public searchTemplates(): Promise<Array<IPageTemplate>> {
            var pageTemplate: IPageTemplate = {
                title: "default",
                content: "<section><div class=\"container\" widget=\"grid\"><div class=\"row\"><div class=\"col-md-12\" widget=\"paper-textblock\"><h1>Hi1</h1></div></div></div></section>"
            };

            return Promise.resolve([pageTemplate]);
        }

        public getLayoutByRoute(route: string): Promise<ILayout> {
            if (!route) {
                return Promise.resolve(null);
            }

            var searchAllTask = this.objectStorage.searchObjects<ILayout>(StorageType[StorageType.layouts]);

            return searchAllTask.then((layouts: Array<ILayout>) => {
                if (layouts && layouts.length) {
                    var filteredPages = _.filter(layouts, (lyout: ILayout) => {
                        var regExp = lyout.uriTemplate;
                        return !!route.match(regExp);
                    });

                    if (filteredPages && filteredPages.length) {
                        let layout: ILayout = _.max(filteredPages, (item: ILayout) => { return item.uriTemplate.length });
                        
                        return layout;
                    }
                    else {
                        return null;
                    }
                }
                else {
                    return null;
                }
            });

        }
    }
}
module Vienna.Widgets {
    import IPermalink = Vienna.Data.IPermalink;
    import IFile = Vienna.Data.IFile;

    export class PageWidget implements IWidgetModel {
        private pagesService: Data.IPageService;
        private permalinkService: IPermalinkService;
        private routeHandler: IRouteHandler;
        private currentPage: Data.IPage;
        private eventManager: IEventManager;
        private disposeBag: Vienna.Utils.IFunctionBag = Vienna.Utils.createFunctionBag();
        private content: IFile;

        public pageContent: KnockoutObservable<string>;

        constructor(pagesService: Data.IPageService, permalinkService: IPermalinkService, routeHandler: IRouteHandler, eventManager: IEventManager) {
            // initialization...
            this.pagesService = pagesService;
            this.permalinkService = permalinkService;
            this.routeHandler = routeHandler;
            this.eventManager = eventManager;

            // rebinding...
            this.onContentChanges = this.onContentChanges.bind(this);
            this.refreshPageContent = this.refreshPageContent.bind(this);
            this.onRouteChange = this.onRouteChange.bind(this);

            // setting up...
            var handle = this.routeHandler.addRouteChangeListener(this.onRouteChange);
            this.disposeBag.add(() => this.routeHandler.removeRouteChangeListener(handle));
            this.pageContent = ko.observable<string>();

            this.refreshPageContent();
            this.pageContent.subscribe(this.onContentChanges);
        }

        public dispose(): void {
            this.disposeBag();
        }

        private refreshPageContent(): void {
            var url = this.routeHandler.getCurrentPageUrl();
            var getPermalinkPromise = this.permalinkService.getPermalinkByUrl(url);

            getPermalinkPromise.then((permalink: IPermalink) => {
                var pageId = permalink.targetKey;

                this.pagesService.getPageByKey(pageId).then((page: Vienna.Data.IPage) => {
                    this.currentPage = page;
                    this.pagesService.getPageContentByKey(page.contentKey).then((content: Data.IFile) => {
                        this.content = content;
                        this.pageContent(content.content);
                        this.eventManager.dispatchEvent("pageContentLoaded");
                    });
                });
            });
        }

        private onRouteChange(): void {
            this.refreshPageContent();
        }

        private onContentChanges(html: string): void {
            if (this.content) {
                this.content.content = html;
                this.pagesService.updatePageContent(this.content);
            }
        }
    }
}
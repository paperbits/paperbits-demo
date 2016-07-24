module Vienna {
    export module Workshops {
        import IPage = Vienna.Data.IPage;
        import IPermalink = Vienna.Data.IPermalink;
        import IPagesService = Vienna.Data.IPageService;
        import IRouteHandler = Vienna.IRouteHandler;
        import ViewManager = Vienna.Ui.ViewManager;

        export class PageDetailsWorkshop {
            private pagesService: Vienna.Data.IPageService;
            private permalinkService: IPermalinkService;
            private routeHandler: Vienna.IRouteHandler;
            private page: Vienna.Data.IPage;
            private viewManager: Vienna.Ui.ViewManager;
            private pagePermalink: IPermalink;

            public key: string;
            public permalinkUrl: KnockoutObservable<string>;
            public title: KnockoutObservable<string>;
            public description: KnockoutObservable<string>;
            public keywords: KnockoutObservable<string>;

            constructor(pagesService: IPagesService, permalinkService: IPermalinkService, routeHandler: IRouteHandler, page: IPage, viewManager: ViewManager) {
                // initialization...
                this.pagesService = pagesService;
                this.permalinkService = permalinkService;
                this.routeHandler = routeHandler;
                this.page = page;
                this.viewManager = viewManager;

                // rebinding...
                //this.onFaviconUploaded = this.onFaviconUploaded.bind(this);
                this.deletePage = this.deletePage.bind(this);
                this.updateMetadata = this.updateMetadata.bind(this);
                this.updatePermalink = this.updatePermalink.bind(this);

                // setting up...
                this.key = page.key;
                this.permalinkUrl = ko.observable<string>();
                this.title = ko.observable<string>(page.title);
                this.description = ko.observable<string>(page.description);
                this.keywords = ko.observable<string>(page.keywords);

                var getPermalinkTask = this.permalinkService.getPermalinkByKey(page.permalinkKey);

                getPermalinkTask.then((permalink: IPermalink) => {
                    this.pagePermalink = permalink;
                    this.permalinkUrl(permalink.uri);
                    this.routeHandler.navigateTo(permalink.uri);
                });

                this.title.subscribe(this.updateMetadata);
                this.description.subscribe(this.updateMetadata);
                this.keywords.subscribe(this.updateMetadata);
                this.permalinkUrl.subscribe(this.updatePermalink);
            }

            private updateMetadata(): void {
                var page: IPage = {
                    key: this.key,
                    title: this.title(),
                    description: this.description(),
                    keywords: this.keywords()
                };

                this.pagesService.updatePage(page);
            }

            private updatePermalink(): void {
                this.pagePermalink.uri = this.permalinkUrl();
                this.permalinkService.updatePermalink(this.pagePermalink);
            }

            public deletePage(): void {
                //TODO: Show confirmation dialog according to mockup
                var deletePageTask = this.pagesService.deletePage(this.page);

                deletePageTask.then(() => {
                    this.routeHandler.navigateTo("/");
                    this.viewManager.closeWorkshop("page-details-workshop");
                    this.viewManager.openWorkshop("pages");
                });
            }
        }
    }
}
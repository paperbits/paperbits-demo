module Vienna {
    export module Workshops {
        import IPage = Vienna.Data.IPage;
        import IPagesService = Vienna.Data.IPageService;
        import IRouteHandler = Vienna.IRouteHandler;
        import ViewManager = Vienna.Ui.ViewManager;

        export class PagesWorkshop {
            private pagesService: IPagesService;
            private routeHandler: IRouteHandler;
            private viewManager: ViewManager;

            public searchPattern: KnockoutObservable<string>;
            public pages: KnockoutObservableArray<IPage>;

            constructor(pagesService: IPagesService, routeHandler: IRouteHandler, viewManager: ViewManager) {
                // initialization...
                this.pagesService = pagesService;
                this.routeHandler = routeHandler;
                this.viewManager = viewManager;

                // rebinding...
                this.onSearchPatternChange = this.onSearchPatternChange.bind(this);
                this.addBlankPage = this.addBlankPage.bind(this);
                this.selectPage = this.selectPage.bind(this);

                // setting up...
                this.pages = ko.observableArray<IPage>();
                this.searchPattern = ko.observable<string>();
                this.searchPattern.subscribe(this.onSearchPatternChange);
                this.onSearchPatternChange("");
            }

            public onSearchPatternChange(searchPattern: string) {
                var searchPagesTask = this.pagesService.search(searchPattern);

                searchPagesTask.then((pages: Array<Data.IPage>) => {
                    this.pages(pages);
                }, error => {
                    //TODO
                });
            }

            public selectPage(page: IPage) {
                this.viewManager.openWorkshop("page-details-workshop", page);
            }

            public addBlankPage() {
                this.viewManager.openWorkshop("page-templates-workshop");

                //var promise = this.pagesService.add();

                //promise.then((newPage: Data.IPage) => {
                //    this.router.go('workshops.pages.page', { pageReference: newPage });
                //});

                //promise.failure(() => {
                //    TODO
                //});
            }
        }
    }
}
module Vienna.Workshops {
    import IContent = Vienna.Data.IFile;
    import IPage = Vienna.Data.IPage;
    import IPagesService = Vienna.Data.IPageService;
    import IPageTemplate = Vienna.Data.IPageTemplate;
    import IPermalink = Vienna.Data.IPermalink;
    import IRouteHandler = Vienna.IRouteHandler;
    import ViewManager = Vienna.Ui.ViewManager;
    import MimeType = Vienna.Data.MimeType;

    export class PageTemplatesWorkshop {
        private pagesService: IPagesService;
        private permalinkService: IPermalinkService;
        private routeHandler: IRouteHandler;
        private viewManager: ViewManager;

        public searchPattern: KnockoutObservable<string>;
        public title: KnockoutObservable<string>;
        public description: KnockoutObservable<string>;
        public keywords: KnockoutObservable<string>;
        public templates: KnockoutObservableArray<IPageTemplate>;

        constructor(pagesService: IPagesService, permalinkService: IPermalinkService, routeHandler: IRouteHandler, viewManager: ViewManager) {
            // initialization...
            this.pagesService = pagesService;
            this.permalinkService = permalinkService;
            this.routeHandler = routeHandler;
            this.viewManager = viewManager;

            // rebinding...
            this.onSearchPatternChange = this.onSearchPatternChange.bind(this);
            this.selectTemplate = this.selectTemplate.bind(this);

            // setting up...
            this.templates = ko.observableArray<IPageTemplate>();

            this.searchPattern = ko.observable<string>();
            this.title = ko.observable<string>();
            this.description = ko.observable<string>();
            this.keywords = ko.observable<string>();

            this.searchPattern.subscribe(this.onSearchPatternChange);
            this.onSearchPatternChange("");
        }

        public onSearchPatternChange(searchPattern: string) {
            var searchTemplatesTask = this.pagesService.searchTemplates();

            searchTemplatesTask.then((templates: Array<IPageTemplate>) => {
                this.templates(templates);
            });

            //var searchPagesTask = this.pagesService.search(searchPattern);

            //searchPagesTask.then((references: Array<Data.IPageReference>) => {
            //    this.pageReferences(references);
            //});

            //searchPagesTask.failure(() => {
            //    //TODO
            //});
        }

        public selectTemplate(template: IPageTemplate) {
            this.pagesService.createPage("New page", "", "").then((page: IPage) => {

                //TODO: In fact we can delay creation of content and permalink
                var createPermalinkPromise = this.permalinkService.createPermalink("/new", page.key);
                var createContentPromise = this.pagesService.createPageContent(template.content);

                Promise.all([createPermalinkPromise, createContentPromise]).then((results) => {
                    var permalink = results[0];
                    var content = results[1];

                    page.permalinkKey = permalink.key;
                    page.contentKey = content.key;

                    this.pagesService.updatePage(page).then(() => {
                        this.routeHandler.navigateTo(permalink.uri);
                        this.viewManager.closeWorkshop("page-templates-workshop");
                        this.viewManager.openWorkshop("page-details-workshop", page);
                    });
                });
            });
        }
    }
}
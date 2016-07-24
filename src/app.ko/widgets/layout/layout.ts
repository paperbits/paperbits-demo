module Vienna.Widgets {
    export var layoutWidgetTemplate = "<div data-bind=\"content: layoutHtml\"></div>";

    export class LayoutWidget implements IWidgetModel {
        private pagesService: Data.IPageService;
        private routeHandler: IRouteHandler;

        public layoutHtml: KnockoutObservable<string>;

        constructor(pagesService: Data.IPageService, routeHandler: IRouteHandler) {
            // initialization...
            this.pagesService = pagesService;
            this.routeHandler = routeHandler;

            // rebinding...
            this.onLayoutLoaded = this.onLayoutLoaded.bind(this);
            this.refreshLayoutContent = this.refreshLayoutContent.bind(this);
            this.onRouteChange = this.onRouteChange.bind(this);

            // setting up...
            this.routeHandler.addRouteChangeListener(this.onRouteChange);
            this.layoutHtml = ko.observable<string>();

            this.refreshLayoutContent();
        }

        private refreshLayoutContent() {
            var uri = this.routeHandler.getCurrentPageUrl();
            var getLayoutTask = this.pagesService.getLayoutByRoute(uri);

            getLayoutTask.then(this.onLayoutLoaded);
        }

        private onLayoutLoaded(layout: Data.ILayout) {
            this.pagesService.getPageContentByKey(layout.contentKey).then((file: Data.IFile) => {
                this.layoutHtml(file.content);
            });
        }

        private onRouteChange() {
            this.refreshLayoutContent();
        }
    }
}

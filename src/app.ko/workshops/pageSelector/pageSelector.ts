module Vienna {
    export module Workshops {
        import IPage = Vienna.Data.IPage;
        import IPermalink = Vienna.Data.IPermalink;
        import IPagesService = Vienna.Data.IPageService;
        export class PageSelector {
            private pagesService: IPagesService;
            private permalinkService: IPermalinkService;
            private onPageSelected: (permaLink: IPermalink) => void;
            public pages: KnockoutObservableArray<IPage>;

            constructor(pagesService: IPagesService, permalinkService: IPermalinkService, onPageSelected: (permaLink: IPermalink) => void) {
                this.pagesService = pagesService;
                this.permalinkService = permalinkService;
                this.pages = ko.observableArray<IPage>();
                this.onPageSelected = onPageSelected;
                this.selectPage = this.selectPage.bind(this);
                this.closeEditor = this.closeEditor.bind(this);
                this.loadPages();
            }

            public loadPages() {
                let searchPagesTask = this.pagesService.search(null);
                searchPagesTask.then((pages: Array<Data.IPage>) => {
                    this.pages(pages);
                });
            }

            public selectPage(page: IPage) {
                if(page){
                    this.permalinkService.getPermalinkByKey(page.permalinkKey).then((result: IPermalink) =>{
                        this.onPageSelected(result);
                    });
                } else {
                    this.onPageSelected(null);
                }
            }

            public closeEditor(): void {
                this.onPageSelected(null);
            }
        }
    }
}

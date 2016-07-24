module Vienna {
    import INavigationService = Vienna.Data.INavigationService;
    import INavigationItem = Vienna.Data.Navigation.INavigationItem;
    import ViewManager = Vienna.Ui.ViewManager;

    export module Workshops {
        export class NavigationWorkshop {
            private navigationService: INavigationService;
            private permalinkService: IPermalinkService;
            private selectedNavigationItem: KnockoutObservable<NavigationTreeNode>;

            public viewManager: ViewManager;
            public navigationItemsTree: KnockoutObservable<NavigationTree>;

            constructor(navigationService: INavigationService, permalinkService: IPermalinkService, viewManager: ViewManager) {
                // initialization...
                this.navigationService = navigationService;
                this.permalinkService = permalinkService;
                this.viewManager = viewManager;

                // rebinding...
                this.onNavigationUpdate = this.onNavigationUpdate.bind(this);
                this.onNavigationItemLoaded = this.onNavigationItemLoaded.bind(this);
                this.selectNavigationItem = this.selectNavigationItem.bind(this);
                this.navigationItemsTree = ko.observable<NavigationTree>();
                this.selectedNavigationItem = ko.observable<NavigationTreeNode>();

                var getNavigationItemsTask = this.navigationService.getNavigationItems();
                getNavigationItemsTask.then(this.onNavigationItemLoaded);
            }

            public onNavigationUpdate(topLevelMenus: Array<INavigationItem>): void {
                this.navigationService.updateNavigationItem(topLevelMenus[0]); //TODO: For now user can have only one menu
            }

            private onNavigationItemLoaded(navigationItems: Array<Data.Navigation.INavigationItem>): void {
                var navigationTree = new NavigationTree(navigationItems);
                this.navigationItemsTree(navigationTree);

                navigationTree.onUpdate.subscribe(this.onNavigationUpdate);
            }

            public addNavigationItem(): void {
                var newNode = this.navigationItemsTree().addNode("< New >");

                this.selectNavigationItem(newNode);
            }

            public selectNavigationItem(navigationItem: NavigationTreeNode): void {
                let permalinkKey = navigationItem.permalinkKey();
                let url = navigationItem.url();
                if (permalinkKey && !url) {
                    this.permalinkService.getPermalinkByKey(permalinkKey).then((permalink) => {
                        navigationItem.url(permalink ? permalink.uri : null);
                        this.selectedNavigationItem(navigationItem);
                        this.viewManager.openWorkshop("navigation-details-workshop", navigationItem);
                    });
                } else {
                    this.selectedNavigationItem(navigationItem);
                    this.viewManager.openWorkshop("navigation-details-workshop", navigationItem);
                }
            }
        }
    }
}
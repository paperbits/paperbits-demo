module Vienna.Widgets.Navbar {
    export class NavbarWidget {
        private navigationService: Data.INavigationService;
        private permalinkService: IPermalinkService;
        private navigationItemId: string;

        public rootNavbarNode: KnockoutObservable<NavbarItem>;

        constructor(navigationService: Data.INavigationService, permalinkService: IPermalinkService, navigationItemId: string) {
            this.navigationService = navigationService;
            this.permalinkService = permalinkService;
            this.navigationItemId = navigationItemId;

            // rebinding...
            this.refreshNavigation = this.refreshNavigation.bind(this);
            this.onNavigationRootReceived = this.onNavigationRootReceived.bind(this);
            this.navigationItemToNode = this.navigationItemToNode.bind(this);

            this.rootNavbarNode = ko.observable<NavbarItem>();

            this.navigationService.addNavigationItemUpdateListener(this.refreshNavigation);
            this.refreshNavigation();
        }

        private refreshNavigation(): void {
            //var getNavigationItemTask = this.navigationService.getNavigationItem(this.navigationItemName);
            //getNavigationItemTask.then(this.onNavigationRootReceived);

            var getNavigationItemTask = this.navigationService.getNavigationItems();
            getNavigationItemTask.then(this.onNavigationRootReceived);
        }

        private onNavigationRootReceived(navigationItems: Array<Data.Navigation.INavigationItem>): void {
            var root = navigationItems.first(x => x.key === this.navigationItemId);
            this.navigationItemToNode(root).then((rootNavbarItem) => {
                this.rootNavbarNode(rootNavbarItem);
            });
        }

        private navigationItemToNode(navItem: Data.Navigation.INavigationItem): Promise<NavbarItem> {
            return new Promise<NavbarItem>((resolve, reject) => {
                var label = navItem.label;

                var url;
                if (navItem.externalUrl) {
                    url = navItem.externalUrl;
                    var node = new NavbarItem(label, url);
                    resolve(node);
                }
                else {
                    if (navItem.permalinkKey) {
                        this.permalinkService.getPermalinkByKey(navItem.permalinkKey).then((permalink) => {
                            url = permalink ? "/#{0}".format(permalink.uri) : "";
                            var node = new NavbarItem(label, url);

                            if (navItem.navigationItems) {
                                var tasks = [];
                                navItem.navigationItems.forEach(child => {
                                    tasks.push(this.navigationItemToNode(child));
                                });

                                Promise.all(tasks).then((results) => {
                                    results.forEach(child => {
                                        node.nodes.push(child);
                                    });
                                    resolve(node);
                                }, reject);
                            } else {
                                resolve(node);
                            }
                        });
                    } else {
                        var node = new NavbarItem(label, "");

                        if (navItem.navigationItems) {
                            var tasks = [];
                            navItem.navigationItems.forEach(child => {
                                tasks.push(this.navigationItemToNode(child));
                            });

                            Promise.all(tasks).then((results) => {
                                results.forEach(child => {
                                    node.nodes.push(child);
                                });
                                resolve(node);
                            }, reject);
                        } else {
                            resolve(node);
                        }
                    }

                }
            });
        }
    }
}
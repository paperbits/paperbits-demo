module Vienna {
    export module Workshops {
        import IPermalink = Vienna.Data.IPermalink;
        export class NavigationDetailsWorkshop {
            private navigationService: Vienna.Data.INavigationService;

            public viewManager: Vienna.Ui.ViewManager;
            public node: NavigationTreeNode;

            constructor(navigationTreeNode: NavigationTreeNode, navigationService: Vienna.Data.INavigationService, viewManager: Vienna.Ui.ViewManager) {
                this.node = navigationTreeNode;

                // initialization...
                this.navigationService = navigationService;
                this.viewManager = viewManager;

                // rebinding...
                this.deleteNavigationItem = this.deleteNavigationItem.bind(this);
                this.openPageSelector = this.openPageSelector.bind(this);
                this.onPageSelected = this.onPageSelected.bind(this);
            }

            public openPageSelector(){
                this.viewManager.itemSelectorName("page-selector");
                this.viewManager.setWidgetEditor({ name: "page-selector", params: this.onPageSelected });
            }

            private onPageSelected(permaLink: IPermalink){
                if(permaLink) {
                    this.node.permalinkKey(permaLink.key);
                    this.node.url(permaLink.uri);
                } else {
                    console.log("page is not selected!!!");
                }
                this.viewManager.closeWidgetEditor();
            }

            public deleteNavigationItem() {
                this.node.remove();
                this.viewManager.closeWorkshop("navigation-details-workshop");
            }
        }
    }
}
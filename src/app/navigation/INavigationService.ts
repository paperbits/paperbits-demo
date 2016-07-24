module Vienna.Data {
    export class NavigationEvents {
        static onNavigationItemUpdate = "onNavigationItemUpdate";
    }

    export interface INavigationService {
        getNavigationItem(name: string): Promise<Data.Navigation.INavigationItem>;
        updateNavigationItem(navigationItem: Data.Navigation.INavigationItem): Promise<void>;
        addNavigationItemUpdateListener(callback: (navigationItem: Data.Navigation.INavigationItem) => void);
        getNavigationItems(): Promise<Array<Data.Navigation.INavigationItem>>;
    }
}
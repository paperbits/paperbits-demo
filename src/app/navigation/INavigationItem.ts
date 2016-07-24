module Vienna.Data.Navigation {
    export interface INavigationItem {
        key: string;
        label: string;
        permalinkKey?: string;
        externalUrl?: string;
        navigationItems?: Array<INavigationItem>;
    }
}
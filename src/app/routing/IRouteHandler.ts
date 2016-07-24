module Vienna {
    export interface IRouteHandler {
        getCurrentPageUrl(): string;
        addRouteChangeListener(callback: () => void): any;
        removeRouteChangeListener(handle: any);
        navigateTo(hash: string);
    }
}
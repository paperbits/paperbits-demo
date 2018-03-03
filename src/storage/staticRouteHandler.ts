import { IRouteHandler } from "@paperbits/common/routing/IRouteHandler";
import { IEventManager } from "@paperbits/common/events/IEventManager";


export class StaticRouteHandler implements IRouteHandler {
    private currentUrl: string;
    private callbacks: any[];

    constructor() {
        this.currentUrl = "/";
        this.navigateTo = this.navigateTo.bind(this);
        this.getCurrentUrl = this.getCurrentUrl.bind(this);

        this.callbacks = [];
    }

    public addRouteChangeListener(callback: () => void): void {
        //this.callbacks.push(callback);
    }

    public removeRouteChangeListener(callback: () => void): void {
        // this.callbacks.spliceremove(callback);
    }

    public navigateTo(hash: string, notifyListeners: boolean = true, forceNotification?: boolean): void {
        this.currentUrl = hash;

        this.callbacks.forEach(callback => {
            callback();
        });
    }

    public getCurrentUrl(): string {
        return this.currentUrl;
    }
}
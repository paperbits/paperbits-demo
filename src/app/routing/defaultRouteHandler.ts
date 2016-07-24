module Vienna {
    class RouteHandlerEvents {
        static onRouteChange = "onRouteChange";
    }

    export class DefaultRouteHandler implements IRouteHandler {
        private hash: string;
        private eventManager: IEventManager;

        constructor(eventManager: IEventManager) {

            // initialization...
            this.eventManager = eventManager;

            // rebinding...
            this.handleHashChangeEvent = this.handleHashChangeEvent.bind(this);
            this.getCurrentPageUrl = this.getCurrentPageUrl.bind(this);

            // setting up...
            this.hash = window.location.hash;

            // subscribing for events...
            window.addEventListener("hashchange", this.handleHashChangeEvent, false);
        }

        private handleHashChangeEvent() {
            this.hash = location.hash;
            this.eventManager.dispatchEvent(RouteHandlerEvents.onRouteChange);
        }

        public addRouteChangeListener(callback: () => void): any {
            return this.eventManager.addEventListener(RouteHandlerEvents.onRouteChange, callback);
        }

        public removeRouteChangeListener(handle: any) {
            this.eventManager.removeEventListener(RouteHandlerEvents.onRouteChange, handle);
        }

        public navigateTo(hash: string) {
            this.hash = hash;
            window.location.hash = hash;
        }

        public getCurrentPageUrl(): string {
            var permalink = this.hash.replace("#", "");

            if (permalink === "") {
                permalink = window.location.pathname;
            }
            else if (permalink === "") {
                permalink = "/";
            }

            return permalink;
        }
    }
}
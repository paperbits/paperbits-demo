module Vienna {
    export class DefaultEventManager implements IEventManager {
        constructor() {
            this.addEventListener = this.addEventListener.bind(this);
            this.dispatchEvent = this.dispatchEvent.bind(this);
        }

        public addEventListener(eventName: string, callback: any): any {
            var handler = (customEvent: CustomEvent) => callback(customEvent.detail);
            document.addEventListener(eventName, handler);
            return handler;
        }

        public removeEventListener(eventName: string, handle: any) {
            document.removeEventListener(eventName, handle);
        }

        public dispatchEvent(eventName: string, args?: any) {
            var customEvent = document.createEvent("CustomEvent");
            customEvent.initCustomEvent(eventName, true, true, args);
            document.dispatchEvent(customEvent);
        }
    }
}
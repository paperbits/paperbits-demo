module Vienna {
    export class Event<T> {
        private eventName: string;

        constructor() {
            this.subscribe = this.subscribe.bind(this);
            this.notifySubscribers = this.notifySubscribers.bind(this);
            this.eventName = Utils.guid();
        }

        public subscribe(callback: any) {
            document.addEventListener(this.eventName, (customEvent: CustomEvent) => {
                callback(customEvent.detail);
            });
        }

        public notifySubscribers(args?: any) {
            var customEvent = new CustomEvent(this.eventName, { detail: args });
            document.dispatchEvent(customEvent);
        }
    }
}
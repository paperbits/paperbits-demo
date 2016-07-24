module Vienna {
    export interface IEventManager {
        addEventListener(eventName: string, callback: any): any;
        removeEventListener(eventName: string, callback: any);
        dispatchEvent(eventName: string);
        dispatchEvent(eventName: string, args: any);
    }
}
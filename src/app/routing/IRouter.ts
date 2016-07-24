module Vienna {
    export interface IRouter {
        addRoute(pattern: any, handler: Function, priority?: number);
        startListening();
    }
}
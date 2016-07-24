module Vienna {
    export interface IDragSourceConfig {
        payload: any;
        sticky: boolean;
        ondragstart?: (payload: any, dragged: HTMLElement) => HTMLElement;
        ondragend?: (payload: any) => void;
        filter?: (candidate: HTMLElement) => boolean;
    }
}
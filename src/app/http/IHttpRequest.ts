module Vienna {
    export interface IHttpRequest {
        url: string;
        method?: string;
        headers?: Array<IHttpHeader>;
        body?: any;
    }
}
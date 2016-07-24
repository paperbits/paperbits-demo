module Vienna {
    export interface IHttpClient {
        sendRequest<T>(request: IHttpRequest): Promise<T>;
    }
}
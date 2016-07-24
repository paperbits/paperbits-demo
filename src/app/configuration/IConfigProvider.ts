module Vienna.Configuration {
    export interface IConfigProvider {
        getSetting(): Promise<any>;
    }
}
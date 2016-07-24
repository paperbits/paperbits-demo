module Vienna.Configuration {
    export class ConfigProvider implements IConfigProvider {
        private httpClient: IHttpClient;
        private configuration: any;

        constructor(httpClient: IHttpClient) {
            this.httpClient = httpClient;
        }

        public getSetting(): Promise<any> {
            if (this.configuration) {
                return Promise.resolve(this.configuration);
            }

            var httpClient = this.httpClient;

            return new Promise((resolve, reject) => {
                httpClient
                    .sendRequest<any>({ url: "config.json" })
                    .then((config) => {
                        var tenantHostname = window.location.hostname;
                        var tenantConfig = config[tenantHostname];

                        resolve(tenantConfig);
                    });
            });
        }
    }
}
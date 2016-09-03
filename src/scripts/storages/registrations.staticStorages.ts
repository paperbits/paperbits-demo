module Paperbits.Registrations {
    export class StaticStoragesRegistration implements IRegistration {
        public register(injector: IInjector): void {
            injector.bindSingleton("fileStorage", Paperbits.Storages.StaticFileStorage);
            injector.bindFactory<Paperbits.Persistence.IObjectStorage>("objectStorage", (ctx: Paperbits.IInjector) => {
                var httpClient = ctx.resolve<Paperbits.Http.IHttpClient>("httpClient");

                let experimentVersion = Utils.getCookie("ab-testing");

                if (!experimentVersion) {
                    experimentVersion = "1";
                }

                let datasourceUrl = `data/experiment${experimentVersion}.json`;

                return new Paperbits.Storages.StaticObjectStorage(datasourceUrl, httpClient);
            });
        }
    }
}
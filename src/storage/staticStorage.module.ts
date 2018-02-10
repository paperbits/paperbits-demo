import { StaticObjectStorage } from "./staticObjectStorage";
import { StaticBlobStorage } from "./staticBlobStorage";
import { StaticUserService } from "./staticUserService";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IObjectStorage } from "@paperbits/common/persistence/IObjectStorage";
import { OfflineObjectStorage } from "@paperbits/common/persistence/offlineObjectStorage";
import { IHttpClient } from "@paperbits/common/http/IHttpClient";



export class StaticStorageModule implements IInjectorModule {
    constructor() {
        this.register = this.register.bind(this);
    }

    public register(injector: IInjector): void {
        injector.bindSingleton("blobStorage", StaticBlobStorage);
        injector.bindSingleton("userService", StaticUserService);

        injector.bindSingletonFactory<IObjectStorage>("objectStorage", (ctx: IInjector) => {
            const httpClient = ctx.resolve<IHttpClient>("httpClient");
            const datasourceUrl = "data/experiment1.json";
            const offlineObjectStorage = ctx.resolve<OfflineObjectStorage>("offlineObjectStorage");
            const objectStorage = new StaticObjectStorage(datasourceUrl, httpClient);

            offlineObjectStorage.registerUnderlyingStorage(objectStorage);

            return offlineObjectStorage;
        });
    }
}
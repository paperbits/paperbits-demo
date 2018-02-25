import { StaticBlobStorage } from "./staticBlobStorage";
import { StaticUserService } from "./staticUserService";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IObjectStorage } from "@paperbits/common/persistence/IObjectStorage";
import { OfflineObjectStorage } from "@paperbits/common/persistence/offlineObjectStorage";
import { StaticLocalObjectStorage } from "./staticLocalObjectStorage";

export class StaticLocalStorageModule implements IInjectorModule {
    private dataSourceUrl: string;
    constructor() {
        this.register = this.register.bind(this);
    }

    public setDataSourceUrl(dataSourceUrl) {
        this.dataSourceUrl = dataSourceUrl;
    }

    public register(injector: IInjector): void {
        if (!this.dataSourceUrl) {
            throw new Error("Please set dataSourceUrl");
        }
        injector.bindSingleton("blobStorage", StaticBlobStorage);
        injector.bindSingleton("userService", StaticUserService);

        injector.bindSingletonFactory<IObjectStorage>("objectStorage", (ctx: IInjector) => {
            
            const offlineObjectStorage = ctx.resolve<OfflineObjectStorage>("offlineObjectStorage");
            const objectStorage = new StaticLocalObjectStorage(this.dataSourceUrl);

            offlineObjectStorage.registerUnderlyingStorage(objectStorage);

            return offlineObjectStorage;
        });
    }
}
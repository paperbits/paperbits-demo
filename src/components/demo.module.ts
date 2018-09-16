/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license.
 */


import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IObjectStorage } from "@paperbits/common/persistence/IObjectStorage";
import { OfflineObjectStorage } from "@paperbits/common/persistence/offlineObjectStorage";
import { IHttpClient } from "@paperbits/common/http/IHttpClient";
import { StaticObjectStorage } from "./staticObjectStorage";
import { StaticBlobStorage } from "./staticBlobStorage";
import { StaticUserService } from "./staticUserService";


export class DemoModule implements IInjectorModule {
    constructor(private datasourceUrl) {
        this.register = this.register.bind(this);
    }

    public register(injector: IInjector): void {
        injector.bindSingleton("blobStorage", StaticBlobStorage);
        injector.bindSingleton("userService", StaticUserService);

        injector.bindSingletonFactory<IObjectStorage>("objectStorage", (ctx: IInjector) => {
            const httpClient = ctx.resolve<IHttpClient>("httpClient");
            const offlineObjectStorage = ctx.resolve<OfflineObjectStorage>("offlineObjectStorage");
            const objectStorage = new StaticObjectStorage(this.datasourceUrl, httpClient);

            offlineObjectStorage.registerUnderlyingStorage(objectStorage);

            return offlineObjectStorage;
        });
    }
}
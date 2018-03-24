/**
 * @license
 * Copyright Vienna LLC. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://paperbits.io/license.
 */


import { StaticBlobStorage } from "./staticBlobStorage";
import { StaticUserService } from "./staticUserService";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IObjectStorage } from "@paperbits/common/persistence/IObjectStorage";
import { OfflineObjectStorage } from "@paperbits/common/persistence/offlineObjectStorage";
import { StaticLocalObjectStorage } from "./staticLocalObjectStorage";

export class StaticLocalStorageModule implements IInjectorModule {    
    constructor(private dataSourceUrl: string) {
        this.register = this.register.bind(this);
    }

    public register(injector: IInjector): void {
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
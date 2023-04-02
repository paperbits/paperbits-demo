/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */


import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { AnchorRouteHandler, HistoryRouteHandler } from "@paperbits/common/routing";
import { SearchDesignModule } from "@paperbits/core/search/search.design.module";
import { RoleBasedSecurityDesignModule } from "@paperbits/core/security/roleBasedSecurity.design.module";
import { App } from "../components/app/app";
import { ClickCounterDesignModule } from "../components/click-counter/clickCounter.design.module";
import { HttpDataProvider } from "../persistence/httpDataProvider";
import { MemoryBlobStorage } from "../persistence/memoryBlobStorage";
import { MemoryObjectStorage } from "../persistence/memoryObjectStorage";
import { StaticRoleService } from "../user/staticRoleService";


export class DemoDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindSingleton("app", App);
        injector.bindSingleton("dataProvider", HttpDataProvider);
        injector.bindSingleton("blobStorage", MemoryBlobStorage);
        injector.bindSingleton("objectStorage", MemoryObjectStorage);
        injector.bindSingleton("roleService", StaticRoleService);
        injector.bindToCollection("autostart", HistoryRouteHandler);
        injector.bindToCollection("autostart", AnchorRouteHandler);
        injector.bindModule(new SearchDesignModule());
        injector.bindModule(new ClickCounterDesignModule());
        injector.bindModule(new RoleBasedSecurityDesignModule());
    }
}
/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */


import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { App } from "./app/app";
import { ConsoleLogger } from "@paperbits/common/logging";
import { StaticObjectStorage } from "./staticObjectStorage";
import { StaticBlobStorage } from "./staticBlobStorage";
import { StaticRoleService } from "./staticRoleService";
import { SearchDesignModule } from "@paperbits/core/search/search.design.module";
import { ClickCounterEditorModule } from "./click-counter/ko/clickCounterEditor.module";


export class DemoDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindSingleton("app", App);
        injector.bindSingleton("blobStorage", StaticBlobStorage);
        injector.bindSingleton("roleService", StaticRoleService);
        injector.bindSingleton("objectStorage", StaticObjectStorage);
        injector.bindSingleton("logger", ConsoleLogger);
        injector.bindModule(new SearchDesignModule());
        injector.bindModule(new ClickCounterEditorModule());
    }
}
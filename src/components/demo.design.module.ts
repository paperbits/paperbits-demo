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
import { RoleSelector, RoleInput } from "@paperbits/core/workshops/roles/ko";
import { StaticObjectStorage } from "./staticObjectStorage";
import { StaticBlobStorage } from "./staticBlobStorage";
import { StaticRoleService } from "./staticRoleService";
import { YourWidgetEditorModule } from "./your-widget/ko/yourWidgetEditor.module";


export class DemoDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindSingleton("app", App);
        injector.bindSingleton("blobStorage", StaticBlobStorage);
        injector.bindSingleton("roleService", StaticRoleService);
        injector.bindSingleton("objectStorage", StaticObjectStorage);
        injector.bindSingleton("logger", ConsoleLogger);
        injector.bindModule(new YourWidgetEditorModule());
        injector.bind("roleSelector", RoleSelector);
        injector.bind("roleInput", RoleInput);
    }
}
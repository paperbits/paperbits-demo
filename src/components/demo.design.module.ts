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
import { StaticUserService } from "./staticUserService";
import { YourWidgetEditorModule } from "./your-widget/ko/yourWidgetEditor.module";


export class DemoDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindSingleton("app", App);
        injector.bindSingleton("blobStorage", StaticBlobStorage);
        injector.bindSingleton("userService", StaticUserService);
        injector.bindSingleton("objectStorage", StaticObjectStorage);
        injector.bindSingleton("logger", ConsoleLogger);
        injector.bindModule(new YourWidgetEditorModule());
    }
}
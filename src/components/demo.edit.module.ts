/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */


import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { StaticObjectStorage } from "./staticObjectStorage";
import { StaticBlobStorage } from "./staticBlobStorage";
import { StaticUserService } from "./staticUserService";
import { YourWidgetEditorModule } from "./your-widget/ko/yourWidgetEditor.module";

export class DemoEditModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindModule(new YourWidgetEditorModule());

        injector.bindSingleton("blobStorage", StaticBlobStorage);
        injector.bindSingleton("userService", StaticUserService);
        injector.bindSingleton("objectStorage", StaticObjectStorage);
    }
}
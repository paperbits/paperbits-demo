/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import "@paperbits/core/ko/bindingHandlers/bindingHandlers.component";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { StyleRuntimeModule } from "@paperbits/styles/styles.runtime.module";
import { StaticUserService } from "../user/staticUserService";
import { StaticRoleService } from "../user/staticRoleService";
import { ClickCounterRuntimeModule } from "../components/click-counter/clickCounter.runtime.module";


export class DemoRuntimeModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindModule(new ClickCounterRuntimeModule());
        injector.bindModule(new StyleRuntimeModule());
        injector.bindSingleton("userService", StaticUserService);
        injector.bindSingleton("roleService", StaticRoleService);
    }
}
/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import "@paperbits/core/ko/bindingHandlers/bindingHandlers.component";
import { RoleBasedSecurityRuntimeModule } from "@paperbits/core/security/roleBasedSecurity.runtime.module";
import { ClickCounterRuntimeModule } from "../components/click-counter/clickCounter.runtime.module";
import { StaticRoleService } from "../user/staticRoleService";
import { StaticUserService } from "../user/staticUserService";

export class DemoRuntimeModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindModule(new ClickCounterRuntimeModule());
        injector.bindSingleton("userService", StaticUserService);
        injector.bindSingleton("roleService", StaticRoleService);
        injector.bindModule(new RoleBasedSecurityRuntimeModule());
    }
}
/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import "@paperbits/core/ko/bindingHandlers/bindingHandlers.component";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { DefaultEventManager } from "@paperbits/common/events";
import { DefaultRouter } from "@paperbits/common/routing";
import { VisibilityGuard } from "@paperbits/common/user";
import { XmlHttpRequestClient } from "@paperbits/common/http";
import { KnockoutRegistrationLoaders } from "@paperbits/core/ko/knockout.loaders";
import { StaticUserService } from "./staticUserService";
import { StaticRoleService } from "./staticRoleService";
import { SearchRuntimeModule } from "@paperbits/core/search/search.runtime.module";

/* Knockout example component */
import { ClickCounterRuntimeModule } from "./click-counter/ko/runtime/clickCounter.runtime.module";

/* Uncomment to switch to Vue example component */
// import { ClickCounterRuntimeModule } from "./click-counter/vue/runtime/clickCounter.runtime.module";

/* Uncomment to switch to React example component */
// import { ClickCounterRuntimeModule } from "./click-counter/react/runtime/clickCounter.runtime.module";

/* Uncomment to switch to Angular example component */
// import { ClickCounterRuntimeModule } from "./click-counter/angular/runtime/clickCounter.runtime.module";


export class DemoRuntimeModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindModule(new KnockoutRegistrationLoaders());
        injector.bindModule(new ClickCounterRuntimeModule());
        injector.bindModule(new SearchRuntimeModule());
        injector.bindSingleton("eventManager", DefaultEventManager);
        injector.bindCollection("autostart");
        injector.bindCollection("routeGuards");
        injector.bindSingleton("router", DefaultRouter);
        injector.bind("httpClient", XmlHttpRequestClient);
        injector.bindToCollection("autostart", VisibilityGuard);
        injector.bindSingleton("userService", StaticUserService);
        injector.bindSingleton("roleService", StaticRoleService);
    }
}
/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { DefaultEventManager } from "@paperbits/common/events";
import { DefaultRouter, DefaultRouteGuard } from "@paperbits/common/routing";
import { VisibilityGuard } from "@paperbits/common/user";
import { KnockoutRegistrationLoaders } from "@paperbits/core/ko/knockout.loaders";
import { SearchResultOutput } from "../themes/website/scripts/searchResultsOutput";
import "@paperbits/core/ko/bindingHandlers/bindingHandlers.component";
import "@paperbits/core/collapsible-panel/runtime/bindingHandlers.toggleCollapsible";
import { CollapseToggle } from "@paperbits/core/collapsible-panel/collapseToggle";
import { StaticUserService } from "./staticUserService";
import { StaticRoleService } from "./staticRoleService";
import { ClickCounterRuntimeModule } from "./click-counter/ko/runtime/clickCounter.runtime.module";
// import { ClickCounterRuntimeModule } from "./click-counter/vue/runtime/clickCounter.runtime.module";


export class DemoRuntimeModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindModule(new KnockoutRegistrationLoaders());
        injector.bindModule(new ClickCounterRuntimeModule());
        injector.bindSingleton("eventManager", DefaultEventManager);
        injector.bindCollection("autostart");
        injector.bindCollection("routeGuards");
        injector.bindSingleton("router", DefaultRouter);
        injector.bind("searchResultOutput", SearchResultOutput);
        injector.bind("collapseToggle", CollapseToggle);
        injector.bindToCollection("autostart", VisibilityGuard);
        injector.bindSingleton("userService", StaticUserService);
        injector.bindSingleton("roleService", StaticRoleService);
    }
}
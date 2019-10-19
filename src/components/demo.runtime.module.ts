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


export class DemoRuntimeModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindModule(new KnockoutRegistrationLoaders());
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
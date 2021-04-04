import { IInjector, IInjectorModule } from "@paperbits/common/injection";

/* Knockout example component */
// import { ClickCounterRuntime } from "./ko/runtime";

/* Uncomment to switch to Vue example component */
// import { ClickCounterRuntime } from "./vue/runtime";

/* Uncomment to switch to React example component */
import { ClickCounterRuntime } from "./react/runtime";

/* Uncomment to switch to Angular example component */
// import { ClickCounterRuntime } from "./angular/runtime";

export class ClickCounterRuntimeModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("clickCounterRuntime", ClickCounterRuntime);
    }
}
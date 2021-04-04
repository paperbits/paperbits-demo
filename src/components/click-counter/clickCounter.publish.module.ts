import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ClickCounterModelBinder } from "./clickCounterModelBinder";


/* Knockout example component */
// import { ClickCounter, ClickCounterViewModelBinder } from "./ko";

/* Uncomment to switch to Vue example component */
// import { ClickCounter, ClickCounterViewModelBinder } from "./vue";

/* Uncomment to switch to React example component */
import { ClickCounter, ClickCounterViewModelBinder } from "./react";

/* Uncomment to switch to Angular example component */
// import { ClickCounter, ClickCounterViewModelBinder } from "./angular";

export class ClickCounterModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("clickCounter", ClickCounter);
        injector.bindToCollection("modelBinders", ClickCounterModelBinder);
        injector.bindToCollection("viewModelBinders", ClickCounterViewModelBinder);
    }
}
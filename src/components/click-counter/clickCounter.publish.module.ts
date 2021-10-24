import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ClickCounterModelBinder } from "./clickCounterModelBinder";
import { ClickCounterViewModelBinder } from "./clickCounterViewModelBinder";
import { ClickCounter } from "./clickCounter";

export class ClickCounterModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("clickCounter", ClickCounter);
        injector.bindToCollection("modelBinders", ClickCounterModelBinder);
        injector.bindToCollection("viewModelBinders", ClickCounterViewModelBinder);
    }
}
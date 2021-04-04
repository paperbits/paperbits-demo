import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ClickCounter } from "./clickCounter";
import { ClickCounterModelBinder } from "../clickCounterModelBinder";
import { ClickCounterViewModelBinder } from "./clickCounterViewModelBinder";


export class ClickCounterModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("clickCounter", ClickCounter);
        injector.bindToCollection("modelBinders", ClickCounterModelBinder);
        injector.bindToCollection("viewModelBinders", ClickCounterViewModelBinder);
    }
}
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { YourWidgetViewModel } from "./yourWidgetViewModel";
import { YourWidgetModelBinder } from "../yourWidgetModelBinder";
import { YourWidgetViewModelBinder } from "./yourWidgetViewModelBinder";


export class YourWidgetModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("yourWidget", YourWidgetViewModel);
        injector.bindToCollection("modelBinders", YourWidgetModelBinder);
        injector.bindToCollection("viewModelBinders", YourWidgetViewModelBinder);
    }
}
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { ClickCounterRuntime } from "./click-counter-runtime";

export class ClickCounterRuntimeModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("clickCounterRuntime", ClickCounterRuntime);
    }
}
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { NgModule, Injector } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { BrowserModule } from "@angular/platform-browser";
import { createCustomElement } from "@angular/elements";
import { ClickCounterRuntime } from "./click-counter-runtime";


@NgModule({
    declarations: [ClickCounterRuntime],
    imports: [BrowserModule],
    entryComponents: [ClickCounterRuntime]
})
export class AngularAppModule {
    constructor(private angularInjector: Injector) {
        const elementConstructor = createCustomElement(ClickCounterRuntime, { injector: this.angularInjector });
        customElements.define("click-counter-runtime", elementConstructor);
    }
}

export class ClickCounterRuntimeModule implements IInjectorModule {
    public register(paperbitsInjector: IInjector): void {
        platformBrowserDynamic()
            .bootstrapModule(AngularAppModule)
            .catch(error => console.log(error));
    }
}
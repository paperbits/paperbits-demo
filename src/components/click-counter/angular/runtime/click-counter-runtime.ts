import template from "./click-counter-runtime.html";
import { Component, Input, NgModule, Injector } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { createCustomElement } from "@angular/elements";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";


@Component({
    selector: "click-counter-runtime",
    template: template
})
export class ClickCounterRuntime {
    public clickCount: number;

    constructor() {
        this.clickCount = 0;
    }

    @Input()
    public readonly initialCount: string;

    public async ngOnInit(): Promise<void> {
        this.clickCount = parseInt(this.initialCount);
    }

    public increaseCount(): void {
        this.clickCount = this.clickCount + 1;
    }
}


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

platformBrowserDynamic()
    .bootstrapModule(AngularAppModule)
    .catch(error => console.log(error));
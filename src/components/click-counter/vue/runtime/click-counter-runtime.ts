import template from "./click-counter-runtime.html";
import { Component, RuntimeComponent, Prop, OnMounted, OnDestroyed } from "@paperbits/common/vue/decorators";


@RuntimeComponent({
    selector: "click-counter-runtime"
})
@Component({
    selector: "click-counter-runtime",
    template: template
})
export class ClickCounterRuntime {
    public clickCount: number;

    constructor() {
        this.clickCount = 0;
    }

    @Prop()
    public readonly initialCount: number;

    @OnMounted()
    public async initialize(): Promise<void> {
        // Your initialization logic
        this.clickCount = this.initialCount;
    }

    @OnDestroyed()
    public async dispose(): Promise<void> {
        // Your cleanup widget logic
    }

    public increaseCount(): void {
        this.clickCount = this.clickCount + 1;
    }
}
/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import template from "./click-counter-runtime.html";
import { Component, RuntimeComponent, Prop, OnMounted, OnDestroyed, Watch } from "@paperbits/vue/decorators";


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
    public readonly initialCount: string;

    @OnMounted()
    public initialize(): void {
        // Your initialization logic
        this.clickCount = parseInt(this.initialCount);
    }

    @Watch("initialCount")
    public onInitialCountChange(): void {
        // Watching for property changes
        this.clickCount = parseInt(this.initialCount);
    }

    @OnDestroyed()
    public async dispose(): Promise<void> {
        // Your cleanup widget logic
    }

    public increaseCount(): void {
        this.clickCount = this.clickCount + 1;
    }
}
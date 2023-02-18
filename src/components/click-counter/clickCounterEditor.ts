/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import template from "./clickCounterEditor.html";
import { Component, Prop, Emit, Watch, OnMounted } from "@paperbits/vue/decorators";
import { ClickCounterModel } from "./clickCounterModel";


@Component({
    selector: "click-counter",
    template: template
})
export class ClickCounterEditor {
    @Prop()
    public initialCount: number;

    @Prop()
    public model: ClickCounterModel;

    @Emit("onChange")
    public onChange: (model: ClickCounterModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        /*
           This method is called after component created. At this moment all the parameters,
           includinig "model", are available.
        */

        this.initialCount = this.model.initialCount;
    }

    @Watch("initialCount")
    public onInitialCountChange(): void {
        this.applyChanges();
    }

    private applyChanges(): void {
        this.model.initialCount = this.initialCount;
        this.onChange(this.model);
    }
}

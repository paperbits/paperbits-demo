/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import * as ko from "knockout";
import template from "./clickCounterEditor.html";
import { ClickCounterModel } from "./clickCounterModel";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { WidgetEditor } from "@paperbits/common/widgets";
import { ChangeRateLimit } from "@paperbits/common/ko/consts";


@Component({
    selector: "click-counter-editor",
    template: template
})
export class ClickCounterEditor implements WidgetEditor<ClickCounterModel> {
    public readonly initialCount: ko.Observable<number>;

    constructor() {
        this.initialCount = ko.observable(0);
    }

    @Param()
    public model: ClickCounterModel;

    @Event()
    public onChange: (model: ClickCounterModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.initialCount(this.model.initialCount);

        this.initialCount
            .extend(ChangeRateLimit)
            .subscribe(this.applyChanges);
    }

    private applyChanges(): void {
        this.model.initialCount = this.initialCount();
        this.onChange(this.model);
    }
}

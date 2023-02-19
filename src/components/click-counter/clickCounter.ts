/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */


import template from "./clickCounter.html";
import { Component } from "@paperbits/vue/decorators";


@Component({
    selector: "click-counter",
    template: template
})
export class ClickCounter {
    public initialCount: number;

    constructor() {
        this.initialCount = 10;
    }
}
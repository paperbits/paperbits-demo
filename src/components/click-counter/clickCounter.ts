/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import * as ko from "knockout";
import template from "./clickCounter.html";
import { Component } from "@paperbits/common/ko/decorators";
import { StyleModel } from "@paperbits/common/styles";

@Component({
    selector: "click-counter",
    template: template
})
export class ClickCounter {
    public readonly runtimeConfig: ko.Observable<string>;
    public readonly styles: ko.Observable<StyleModel>;

    constructor() {
        this.runtimeConfig = ko.observable();
        this.styles = ko.observable<StyleModel>();
    }
}

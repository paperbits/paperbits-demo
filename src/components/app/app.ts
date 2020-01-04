/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import template from "./app.html";
import { ViewManager } from "@paperbits/common/ui";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "app",
    template: template
})
export class App {
    constructor(private readonly viewManager: ViewManager) { }

    @OnMounted()
    public async initialize(): Promise<void> {
        this.viewManager.setHost({ name: "page-host" });
        this.viewManager.showToolboxes();
    }
}
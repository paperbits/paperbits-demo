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
import { Logger } from "@paperbits/common/logging";

@Component({
    selector: "app",
    template: template
})
export class App {
    constructor(
        private readonly logger: Logger,
        private readonly viewManager: ViewManager
    ) { }

    @OnMounted()
    public async initialize(): Promise<void> {
        this.viewManager.setHost({ name: "page-host" });
        this.viewManager.showToolboxes();
        this.logger.trackEvent("Startup", { message: `App started.` });
    }
}
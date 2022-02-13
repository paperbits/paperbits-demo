/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import template from "./app.html";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { Logger } from "@paperbits/common/logging";
import { EventManager } from "@paperbits/common/events";
import { ViewManager } from "@paperbits/common/ui/viewManager";

@Component({
    selector: "app",
    template: template
})
export class App {
    constructor(
        private readonly logger: Logger,
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager
    ) { }

    @OnMounted()
    public async initialize(): Promise<void> {
        this.viewManager.setHost({ name: "page-host" });
        this.viewManager.showToolboxes();
        this.logger.trackEvent("Startup", { message: `App started.` });

        setTimeout(() => this.eventManager.dispatchEvent("displayHint", {
            key: "a69b",
            content: `When you're in the administrative view, you still can navigate any website hyperlink by clicking on it holding Ctrl (Windows) or ⌘ (Mac) key.`
        }), 5000);
    }
}
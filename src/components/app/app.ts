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
import { detect } from "detect-browser"
import { versionCompare } from "../utils";

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
        const browser = detect();
        switch(browser.name) {
            case "chrome": {
                versionCompare(browser.version, "83.0.4103.116", null) > -1 ? this.supportedBrowser() : this.notSupportedBrowser();
                break;
            }
            case "safari": {
                versionCompare(browser.version, "13.1.1", null) > -1 ? this.supportedBrowser() : this.notSupportedBrowser();
                break;
            }
            case "firefox": {
                versionCompare(browser.version, "77.0.1", null) > -1 ? this.supportedBrowser() : this.notSupportedBrowser();
                break;
            }
            default: {
                browser.name.includes("edge") ? this.supportedBrowser() : this.notSupportedBrowser();
                break;
            }
        }
    }

    private async supportedBrowser(): Promise<void> {
        this.viewManager.setHost({ name: "page-host" });
        this.viewManager.showToolboxes();
        this.logger.traceEvent("App started.");
    }

    private async notSupportedBrowser(): Promise<void> {
        this.viewManager.setHost({ name: "invalid-browser" });
        this.viewManager.removeShutter();
        this.logger.traceEvent("App started.");
    }
}
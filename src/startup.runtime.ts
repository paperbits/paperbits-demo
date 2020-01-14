/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import "./polyfills";
import "./themes/website/scripts";
import { InversifyInjector } from "@paperbits/common/injection";
import { DemoRuntimeModule } from "./components/demo.runtime.module";
import { HistoryRouteHandler, LocationRouteHandler } from "@paperbits/common/routing";


document.addEventListener("DOMContentLoaded", () => {
    const injector = new InversifyInjector();
    injector.bindModule(new DemoRuntimeModule());

    if (location.href.contains("designtime=true")) {
        injector.bindToCollection("autostart", HistoryRouteHandler);
    }
    else {
        injector.bindToCollection("autostart", LocationRouteHandler);
    }
    
    injector.resolve("autostart");
});
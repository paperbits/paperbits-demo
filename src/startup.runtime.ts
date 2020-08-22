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


document.addEventListener("DOMContentLoaded", () => {
    const injector = new InversifyInjector();
    injector.bindModule(new DemoRuntimeModule());
    injector.resolve("autostart");
});
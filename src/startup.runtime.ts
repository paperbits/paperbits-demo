/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import "./polyfills";
import { InversifyInjector } from "@paperbits/common/injection";
import { CoreRuntimeModule } from "@paperbits/core/core.runtime.module";
import { StyleRuntimeModule } from "@paperbits/styles/styles.runtime.module";
import { DemoRuntimeModule } from "./modules/demo.runtime.module";
import { VueModule } from "@paperbits/vue/vue.module";


document.addEventListener("DOMContentLoaded", () => {
    /* Initializing dependency injection  */
    const injector = new InversifyInjector();
    injector.bindModule(new CoreRuntimeModule());
    injector.bindModule(new StyleRuntimeModule());
    injector.bindModule(new DemoRuntimeModule());
    injector.bindModule(new VueModule());
    injector.resolve("autostart");
});

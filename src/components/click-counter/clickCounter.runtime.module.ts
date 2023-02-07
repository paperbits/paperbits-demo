/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { IInjector, IInjectorModule } from "@paperbits/common/injection";

// Registration for classic component definition
import { ClickCounterRuntime } from "./click-counter-runtime";

// Imports for classic component definition
// import { registerCustomElement } from "@paperbits/vue/utils";
// import ClickCounterRuntime from "./click-counter-runtime-classic";


export class ClickCounterRuntimeModule implements IInjectorModule {
    public register(injector: IInjector): void {
        // Registration for classic component definition
        // registerCustomElement(ClickCounterRuntime, "click-counter-runtime");

        // Registration for decorator-based component definition
        // injector.bind("click-counter-rutime", ClickCounterRuntime);
    }
}
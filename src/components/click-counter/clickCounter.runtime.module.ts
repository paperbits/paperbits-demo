/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { IInjector, IInjectorModule } from "@paperbits/common/injection";


import { registerCustomElement } from "@paperbits/vue/customElements";

// Class-based component definition
// import { ClickCounterRuntime } from "./click-counter-runtime";

// Classic component definition
import ClickCounterRuntime from "./click-counter-runtime-classic";


export class ClickCounterRuntimeModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("click-counter-rutime", ClickCounterRuntime);
        registerCustomElement(ClickCounterRuntime, "click-counter-runtime", injector);
    }
}
/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ClickCounterModelBinder } from "./clickCounterModelBinder";
import { ClickCounterViewModelBinder } from "./clickCounterViewModelBinder";
import { ClickCounter } from "./clickCounter";
import { IWidgetService } from "@paperbits/common/widgets";
import { ClickCounterModel } from "./clickCounterModel";
import { VueComponentBinder } from "@paperbits/vue/bindings";


export class ClickCounterPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("clickCounter", ClickCounter);
        injector.bindSingleton("clickCounterModelBinders", ClickCounterModelBinder);
        injector.bindSingleton("clickCounterViewModelBinders", ClickCounterViewModelBinder);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("click-counter", {
            componentBinder: VueComponentBinder,
            componentDefinition: ClickCounter,
            modelBinder: ClickCounterModelBinder,
            modelDefinition: ClickCounterModel,
            viewModelBinder: ClickCounterViewModelBinder
        });
    }
}
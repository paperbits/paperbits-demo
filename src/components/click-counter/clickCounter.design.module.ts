/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IWidgetService } from "@paperbits/common/widgets";
import { VueComponentBinder } from "@paperbits/vue/bindings";
import { ClickCounter } from "./clickCounter";
import { ClickCounterEditor } from "./clickCounterEditor";
import { ClickCounterHandlers } from "./clickCounterHandlers";
import { ClickCounterModel } from "./clickCounterModel";
import { ClickCounterModelBinder } from "./clickCounterModelBinder";
import { ClickCounterViewModelBinder } from "./clickCounterViewModelBinder";


export class ClickCounterDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("clickCounter", ClickCounter);
        injector.bind("clickCounterEditor", ClickCounterEditor);
        injector.bindSingleton("clickCounterModelBinders", ClickCounterModelBinder);
        injector.bindSingleton("clickCounterViewModelBinders", ClickCounterViewModelBinder);
        injector.bindSingleton("clickCounterHandlers", ClickCounterHandlers);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("click-counter", {
            componentBinder: VueComponentBinder,
            componentDefinition: ClickCounter,
            modelBinder: ClickCounterModelBinder,
            modelDefinition: ClickCounterModel,
            viewModelBinder: ClickCounterViewModelBinder
        });

        widgetService.registerWidgetEditor("click-counter", {
            displayName: "Click counter",
            componentBinder: VueComponentBinder,
            componentDefinition: ClickCounterEditor,
            handlerComponent: ClickCounterHandlers,
            iconClass: "widget-icon widget-icon-component"
        });
    }
}
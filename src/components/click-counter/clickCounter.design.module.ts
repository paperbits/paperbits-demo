/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IWidgetService } from "@paperbits/common/widgets";
import { KnockoutComponentBinder } from "@paperbits/core/ko/knockoutComponentBinder";
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
        injector.bindSingleton("clickCounterModelBinder", ClickCounterModelBinder);
        injector.bindSingleton("clickCounterViewModelBinder", ClickCounterViewModelBinder);
        injector.bindSingleton("clickCounterHandlers", ClickCounterHandlers);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("click-counter", {
            modelDefinition: ClickCounterModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: ClickCounter,
            modelBinder: ClickCounterModelBinder,
            viewModelBinder: ClickCounterViewModelBinder
        });

        widgetService.registerWidgetEditor("click-counter", {
            displayName: "Click couter",
            iconClass: "widget-icon widget-icon-component",
            componentBinder: KnockoutComponentBinder,
            componentDefinition: ClickCounterEditor,
            handlerComponent: ClickCounterHandlers,
            requires: ["html", "js"]
        });
    }
}
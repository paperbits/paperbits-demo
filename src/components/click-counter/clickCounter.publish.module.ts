/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IWidgetService } from "@paperbits/common/widgets";
import { ReactComponentBinder } from "@paperbits/react/bindings";
import { ClickCounter } from "./clickCounter";
import { ClickCounterModel } from "./clickCounterModel";
import { ClickCounterModelBinder } from "./clickCounterModelBinder";
import { ClickCounterViewModelBinder } from "./clickCounterViewModelBinder";

export class ClickCounterPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("clickCounter", ClickCounter);
        injector.bindSingleton("clickCounterModelBinders", ClickCounterModelBinder);
        injector.bindSingleton("clickCounterViewModelBinders", ClickCounterViewModelBinder);

        const registry = injector.resolve<IWidgetService>("widgetService");

        registry.registerWidget("click-counter", {
            modelDefinition: ClickCounterModel,
            modelBinder: ClickCounterModelBinder,
            viewModelBinder: ClickCounterViewModelBinder,
            componentBinder: ReactComponentBinder,
            componentDefinition: ClickCounter
        });
    }
}
/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { StyleCompiler } from "@paperbits/common/styles";
import { ViewModelBinder, WidgetState } from "@paperbits/common/widgets";
import { ClickCounterModel } from "./clickCounterModel";
import { ClickCounter } from "./clickCounter";


export class ClickCounterViewModelBinder implements ViewModelBinder<ClickCounterModel, ClickCounter>  {
    constructor(private readonly styleCompiler: StyleCompiler) { }

    public stateToInstance(nextState: WidgetState, componentInstance: ClickCounter): void {
        componentInstance.setState(prevState => ({
            classNames: nextState.styles,
            runtimeConfig: nextState.runtimeConfig
        }));
    }

    public async modelToState(model: ClickCounterModel, state: WidgetState): Promise<void> {
        if (model.styles) {
            state.styles = await this.styleCompiler.getStyleModelAsync(model.styles);
        }

        state.runtimeConfig = { initialCount: model.initialCount };
    }
}
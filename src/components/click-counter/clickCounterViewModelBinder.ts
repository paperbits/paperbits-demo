import { ViewModelBinder, WidgetState } from "@paperbits/common/widgets";
import { ClickCounterModel } from "./clickCounterModel";
import { ClickCounter } from "./clickCounter";
import { StyleCompiler } from "@paperbits/common/styles";

export class ClickCounterViewModelBinder implements ViewModelBinder<ClickCounterModel, ClickCounter>  {
    constructor(private readonly styleCompiler: StyleCompiler) { }

    public async modelToState(model: ClickCounterModel, state: WidgetState): Promise<void> {
        if (model.styles) {
            state.styles = await this.styleCompiler.getStyleModelAsync(model.styles);
        }

        state.runtimeConfig = { initialCount: model.initialCount };
    }

    public stateToInstance(state: WidgetState, componentInstance: ClickCounter): void {
        componentInstance.styles(state.styles);
        componentInstance.runtimeConfig(JSON.stringify(state.runtimeConfig));
    }
}
import { ClickCounterViewModel } from "./clickCounterViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ClickCounterModel } from "../clickCounterModel";
import { EventManager } from "@paperbits/common/events";
import { IWidgetBinding } from "@paperbits/common/editing";
import { Bag } from "@paperbits/common";

export class ClickCounterViewModelBinder implements ViewModelBinder<ClickCounterModel, ClickCounterViewModel>  {
    constructor(private readonly eventManager: EventManager) { }

    public async modelToViewModel(model: ClickCounterModel, viewModel?: ClickCounterViewModel, bindingContext?: Bag<any>): Promise<ClickCounterViewModel> {
        if (!viewModel) {
            viewModel = new ClickCounterViewModel();
        }

        viewModel.runtimeConfig(JSON.stringify({ initialCount: model.initialCount }));

        const binding: IWidgetBinding<ClickCounterModel> = {
            name: "click-counter",
            displayName: "Click counter",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            draggable: true,
            editor: "click-counter-editor",
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: ClickCounterModel): boolean {
        return model instanceof ClickCounterModel;
    }
}
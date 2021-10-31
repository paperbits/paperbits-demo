import { Bag } from "@paperbits/common";
import { ComponentFlow, IWidgetBinding } from "@paperbits/common/editing";
import { EventManager, Events } from "@paperbits/common/events";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ClickCounterModel } from "./clickCounterModel";
import { ClickCounter } from "./clickCounter";

export class ClickCounterViewModelBinder implements ViewModelBinder<ClickCounterModel, ClickCounter>  {
    constructor(private readonly eventManager: EventManager) { }

    public async modelToViewModel(model: ClickCounterModel, viewModel?: ClickCounter, bindingContext?: Bag<any>): Promise<ClickCounter> {
        if (!viewModel) {
            viewModel = new ClickCounter();
        }

        viewModel.runtimeConfig(JSON.stringify({ initialCount: model.initialCount }));

        const binding: IWidgetBinding<ClickCounterModel, ClickCounter> = {
            name: "click-counter",
            displayName: "Click counter",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            flow: ComponentFlow.Block,
            draggable: true,
            editor: "click-counter-editor",
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: ClickCounterModel): boolean {
        return model instanceof ClickCounterModel;
    }
}
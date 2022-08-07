import { Bag } from "@paperbits/common";
import { ComponentFlow, IWidgetBinding } from "@paperbits/common/editing";
import { EventManager, Events } from "@paperbits/common/events";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ClickCounterModel } from "./clickCounterModel";
import { ClickCounter } from "./clickCounter";
import { ClickCounterHandlers } from "./clickCounterHandlers";
import { StyleCompiler } from "@paperbits/common/styles";


export class ClickCounterViewModelBinder implements ViewModelBinder<ClickCounterModel, ClickCounter>  {
    constructor(
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler
    ) { }

    public async modelToViewModel(model: ClickCounterModel, viewModel?: ClickCounter, bindingContext?: Bag<any>): Promise<ClickCounter> {
        if (!viewModel) {
            viewModel = new ClickCounter();
        }

        viewModel.runtimeConfig(JSON.stringify({ initialCount: model.initialCount }));

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager, ClickCounterHandlers));
        }

        const binding: IWidgetBinding<ClickCounterModel, ClickCounter> = {
            name: "click-counter",
            displayName: "Click counter",
            layer: bindingContext?.layer,
            model: model,
            flow: ComponentFlow.Block,
            handler: ClickCounterHandlers,
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
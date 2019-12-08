import { YourWidgetViewModel } from "./yourWidgetViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { YourWidgetModel } from "../yourWidgetModel";
import { EventManager } from "@paperbits/common/events";
import { IWidgetBinding } from "@paperbits/common/editing";
import { Bag } from "@paperbits/common";

export class YourWidgetViewModelBinder implements ViewModelBinder<YourWidgetModel, YourWidgetViewModel>  {
    constructor(private readonly eventManager: EventManager) { }

    public async modelToViewModel(model: YourWidgetModel, viewModel?: YourWidgetViewModel, bindingContext?: Bag<any>): Promise<YourWidgetViewModel> {
        if (!viewModel) {
            viewModel = new YourWidgetViewModel();
        }

        const binding: IWidgetBinding<YourWidgetModel> = {
            name: "your-widget",
            displayName: "Your widget",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            editor: "your-widget-editor",
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: YourWidgetModel): boolean {
        return model instanceof YourWidgetModel;
    }
}
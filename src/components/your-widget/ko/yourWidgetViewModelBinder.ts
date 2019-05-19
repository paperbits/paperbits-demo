import { YourWidgetViewModel } from "./yourWidgetViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { YourWidgetModel } from "../yourWidgetModel";
import { IEventManager } from "@paperbits/common/events";
import { IWidgetBinding } from "@paperbits/common/editing";

export class YourWidgetViewModelBinder implements ViewModelBinder<YourWidgetModel, YourWidgetViewModel>  {
    constructor(private readonly eventManager: IEventManager) { }

    public async modelToViewModel(model: YourWidgetModel, viewModel?: YourWidgetViewModel): Promise<YourWidgetViewModel> {
        if (!viewModel) {
            viewModel = new YourWidgetViewModel();
        }

        const binding: IWidgetBinding = {
            displayName: "Your widget",
            model: model,
            editor: "your-widget-editor",
            applyChanges: () => {
                this.modelToViewModel(model, viewModel);
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
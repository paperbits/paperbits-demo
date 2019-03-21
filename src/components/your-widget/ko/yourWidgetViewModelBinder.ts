import { YourWidgetViewModel } from "./yourWidgetViewModel";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { YourWidgetModel } from "../yourWidgetModel";
import { IEventManager } from "@paperbits/common/events";
import { IWidgetBinding } from "@paperbits/common/editing";

export class YourWidgetViewModelBinder implements IViewModelBinder<YourWidgetModel, YourWidgetViewModel>  {
    constructor(private readonly eventManager: IEventManager) { }

    public modelToViewModel(model: YourWidgetModel, viewModel?: YourWidgetViewModel): YourWidgetViewModel {
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
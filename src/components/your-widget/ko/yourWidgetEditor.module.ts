import { YourWidgetModule } from "./yourWidget.module";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { YourWidgetEditor } from "./yourWidgetEditor";
import { YourWidgetHandlers } from "../yourWidgetHandlers";

export class YourWidgetEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindModule(new YourWidgetModule());
        injector.bind("yourWidgetEditor", YourWidgetEditor);
        injector.bindToCollection("widgetHandlers", YourWidgetHandlers);
    }
}
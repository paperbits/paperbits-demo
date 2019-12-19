import { ClickCounterModule } from "./clickCounter.module";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ClickCounterEditor } from "./clickCounterEditor";
import { ClickCounterHandlers } from "../clickCounterHandlers";

export class ClickCounterEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindModule(new ClickCounterModule());
        injector.bind("clickCounterEditor", ClickCounterEditor);
        injector.bindToCollection("widgetHandlers", ClickCounterHandlers);
    }
}
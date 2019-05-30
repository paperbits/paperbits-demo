import template from "./yourWidgetEditor.html";
import { YourWidgetModel } from "../yourWidgetModel";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { WidgetEditor } from "@paperbits/common/widgets";

@Component({
    selector: "your-widget-editor",
    template: template,
    injectable: "yourWidgetEditor"
})
export class YourWidgetEditor implements WidgetEditor<YourWidgetModel> {
    @Param()
    public model: YourWidgetModel;

    @Event()
    public onChange: (model: YourWidgetModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        // This method is called after component created. At this moment all the parameters, includinig "model", are available.
    }
}
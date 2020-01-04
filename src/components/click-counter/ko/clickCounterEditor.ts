import * as ko from "knockout";
import template from "./clickCounterEditor.html";
import { ClickCounterModel } from "../clickCounterModel";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { WidgetEditor } from "@paperbits/common/widgets";

@Component({
    selector: "click-counter-editor",
    template: template
})
export class ClickCounterEditor implements WidgetEditor<ClickCounterModel> {
    public readonly initialCount: ko.Observable<string>;

    constructor() {
        this.initialCount = ko.observable("0");
    }

    @Param()
    public model: ClickCounterModel;

    @Event()
    public onChange: (model: ClickCounterModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        /*
           This method is called after component created. At this moment all the parameters,
           includinig "model", are available.
        */

        this.initialCount(this.model.initialCount?.toString());
        this.initialCount.subscribe(this.applyChanges);
    }

    private applyChanges(): void {
        this.model.initialCount = parseInt(this.initialCount());
        this.onChange(this.model);
    }
}

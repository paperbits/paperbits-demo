import * as ko from "knockout";
import template from "./clickCounter.html";
import { Component } from "@paperbits/common/ko/decorators";

@Component({
    selector: "click-counter",
    template: template
})
export class ClickCounter {
    public readonly runtimeConfig: ko.Observable<string>;

    constructor() {
        this.runtimeConfig = ko.observable();
    }
}

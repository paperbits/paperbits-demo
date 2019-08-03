import template from "./app.html";
import { IViewManager } from "@paperbits/common/ui";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "app",
    template: template,
    injectable: "app"
})
export class App {
    constructor(private readonly viewManager: IViewManager) { }

    @OnMounted()
    public async initialize(): Promise<void> {
        this.viewManager.setHost({ name: "content-host" });
        this.viewManager.showToolboxes();
    }
}
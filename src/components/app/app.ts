import template from "./app.html";
import { ViewManager } from "@paperbits/common/ui";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "app",
    template: template,
    injectable: "app"
})
export class App {
    constructor(private readonly viewManager: ViewManager) { }

    @OnMounted()
    public async initialize(): Promise<void> {
        this.viewManager.setHost({ name: "content-host" });
        this.viewManager.showToolboxes();
    }
}
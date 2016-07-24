module Vienna {
    export module Workshops {
        import IWidgetOrder = Vienna.Editing.IWidgetOrder;
        import IWidgetService = Vienna.Data.IWidgetService;
        import LayoutEditor = Vienna.Editing.LayoutEditor;
        import ViewManager = Vienna.Ui.ViewManager;

        export class WidgetsWorkshop {
            private widgetService: Vienna.Data.IWidgetService;

            public viewManager: Vienna.Ui.ViewManager;
            public widgets: KnockoutObservable<Array<WidgetItem>>;
            public layoutEditor: Vienna.Editing.LayoutEditor;

            constructor(widgetService: IWidgetService, layoutEditor: LayoutEditor, viewManager: ViewManager) {
                // initialization...
                this.widgetService = widgetService;
                this.layoutEditor = layoutEditor;
                this.viewManager = viewManager;

                // rebinding...
                this.onWidgetsLoaded = this.onWidgetsLoaded.bind(this);
                this.onDragStart = this.onDragStart.bind(this);
                this.onDragEnd = this.onDragEnd.bind(this);

                this.widgets = ko.observable<Array<WidgetItem>>();

                var widgetsTask = this.widgetService.getWidgetOrders();

                widgetsTask.then(this.onWidgetsLoaded);
            }

            private onWidgetsLoaded(widgetOrders: Array<IWidgetOrder>): void {
                var items = new Array<WidgetItem>();

                widgetOrders.forEach((widgetOrder) => {
                    var widgetItem = new WidgetItem();

                    widgetItem.title = widgetOrder.title;
                    widgetItem.widgetOrder = widgetOrder;

                    items.push(widgetItem);
                });

                this.widgets(items);
            }

            public onDragStart(item: WidgetItem): HTMLElement {
                this.viewManager.foldEverything();

                var widgetElement = item.widgetOrder.factory().element;

                item.element = widgetElement;
                return widgetElement;
            }

            public onDragEnd(item: WidgetItem): void {
                this.layoutEditor.onWidgetDragEnd(item, item.element);
                this.layoutEditor.applyBindingsToWidget(item.element);
            }
        }
    }
}
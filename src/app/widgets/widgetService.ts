module Vienna.Data {
    import IFileStorage = Vienna.Persistence.IFileStorage;

    export class WidgetService implements Data.IWidgetService {
        private widgetHandlers: Array<Editing.IWidgetable>;

        constructor(widgetHandlers: Array<Editing.IWidgetable>) {
            this.widgetHandlers = widgetHandlers;
            
            // rebinding...
            this.getWidgetOrders = this.getWidgetOrders.bind(this);
        }

        public getWidgetOrders(): Promise<Array<Editing.IWidgetOrder>> {
            var widgetOrders = new Array<Editing.IWidgetOrder>();

            return Promise.all(this.widgetHandlers.map((handler: Editing.IWidgetable) => {
                var getWidgetOrderTask = handler.getWidgetOrder();

                getWidgetOrderTask.then((order: Editing.IWidgetOrder) => {
                    widgetOrders.push(order);
                });

                return getWidgetOrderTask;
            }));
        }
    }
}
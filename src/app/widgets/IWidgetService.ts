module Vienna.Data {
    export interface IWidgetService {
        getWidgetOrders(): Promise<Array<Vienna.Editing.IWidgetOrder>>;
    }
}
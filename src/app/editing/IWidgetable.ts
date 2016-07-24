module Vienna.Editing {
    export interface IWidgetable {
        getWidgetOrder(): Promise<IWidgetOrder>;
    }
}
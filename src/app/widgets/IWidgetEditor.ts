module Vienna.Widgets {
    export interface IWidgetEditor<T> {
        setWidgetViewModel(viewModel: T);
    }
}
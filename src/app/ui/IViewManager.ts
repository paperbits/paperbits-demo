module Vienna.Ui {
    export interface IViewManager {
        addProgressIndicator(title: string, content: string, progress?: number);
        addPromiseProgressIndicator<T>(task: ProgressPromise<T>, title: string, content: string);
    }
}
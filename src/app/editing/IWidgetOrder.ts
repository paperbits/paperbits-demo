module Vienna.Editing {
    export interface IWidgetOrder { //to be displayed in UI and enough to build new HTML element
        title: string;
        factory(): IWidgetFactoryResult;
    }

    export interface IWidgetFactoryResult {
        element: HTMLElement;
        mediaUploaded?(source: File | string, uploadedUrl: string);
    }
}
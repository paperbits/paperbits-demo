module Vienna.Editing {
    export interface IContentDropHandler {
        getContentDescriptorByDataTransfer(dataTransfer: IDataTransfer): IContentDescriptor;
        getContentDescriptorByMedia(item: Vienna.Data.IMedia): Editing.IContentDescriptor;
    }

    export interface IDataTransfer {
        getData(format: string): string;
        files: File[];
    }

    export interface IContentDescriptor {
        title: string | KnockoutObservable<string>;
        description: string;
        getWidgetOrder?(): Promise<Editing.IWidgetOrder>;
        previewUrl?: string | KnockoutObservable<string>;
        thumbnailUrl?: string | KnockoutObservable<string>;
        uploadables?: (File | string)[];
    }
}
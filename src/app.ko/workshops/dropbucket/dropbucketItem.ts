module Vienna {
    export module Workshops {
        export class DropBucketItem {
            public title: string | KnockoutObservable<string>;
            public description: string;
            public previewUrl: string | KnockoutObservable<string>;
            public thumbnailUrl: string | KnockoutObservable<string>;
            public widgetOrder: KnockoutObservable<Editing.IWidgetOrder>;
            public uploadables: KnockoutObservableArray<File | string>;
            public uploadablesPending: Promise<any>;
            public widget: Editing.IWidgetFactoryResult;

            constructor() {
                this.title = null;
                this.description = null;
                this.previewUrl = null;
                this.thumbnailUrl = null;
                this.uploadables = ko.observableArray<File | string>();
                this.widgetOrder = ko.observable<Editing.IWidgetOrder>();
            }
        }
    }
}
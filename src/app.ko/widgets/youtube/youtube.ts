/// <reference path="../../../app/core/extensions.ts" />

module Vienna.Widgets.Youtube {
    export class Youtube implements IWidgetModel {
        public videoId: KnockoutObservable<string>;

        constructor() {
            this.videoId = ko.observable<string>();
        }

        public getStateMap(): any {
            return {
                videoId: this.videoId
            }
        }
    }
}
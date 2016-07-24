module Vienna.Widgets.Video {
    export class Video implements IWidgetModel {
        public sourceUrl: KnockoutObservable<string>;
        public controls: KnockoutObservable<boolean>;
        public autoplay: KnockoutObservable<boolean>;

        constructor() {
            this.sourceUrl = ko.observable<string>();
            this.controls = ko.observable<boolean>();
            this.autoplay = ko.observable<boolean>();
        }

        public getStateMap(): any {
            return {
                src: this.sourceUrl,
                controls: this.controls,
                autoplay: this.autoplay
            }
        }
    }
}
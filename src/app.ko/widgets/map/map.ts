module Vienna.Widgets.Map {
    export class Map implements IWidgetModel {
        public location: KnockoutObservable<string>;
        public caption: KnockoutObservable<string>;
        public layout: KnockoutObservable<string>;
        public animation: KnockoutObservable<string>;
        public zoomControl: KnockoutObservable<string>;

        constructor(location: string, caption: string, layout: string = "none") {
            this.location = ko.observable<string>(location);
            this.caption = ko.observable<string>(caption != null ? caption : location);
            this.layout = ko.observable<string>(layout);
            this.zoomControl = ko.observable<string>("hide");
        }

        public getStateMap(): any {
            return {
                location: this.location,
                caption: this.caption,
                layout: this.layout,
                zoomcontrol: this.zoomControl
            }
        }
    }
}
module Vienna.Widgets.Picture {
    export class Picture implements IWidgetModel {
        public sourceUrl: KnockoutObservable<string>;
        public caption: KnockoutObservable<string>;
        public action: KnockoutObservable<string>;
        public layout: KnockoutObservable<string>;
        public animation: KnockoutObservable<string>;

        constructor(private lightbox: Ui.ILightbox) {
            this.sourceUrl = ko.observable<string>();
            this.caption = ko.observable<string>();
            this.action = ko.observable<string>("none");
            this.layout = ko.observable<string>("polaroid");
            this.animation = ko.observable<string>("none");
        }

        public getStateMap(): any {
            return {
                src: this.sourceUrl,
                caption: this.caption,
                action: this.action,
                layout: ko.pureComputed<string>({
                    read: this.layout,
                    write: l => this.layout(l ? l : "polaroid")
                }),
                animation: this.animation
            }
        }

        public click() {
            // TODO: It's not wired up until Reading mode is implemented.
            this.lightbox.show(this.sourceUrl());
        }
    }
}
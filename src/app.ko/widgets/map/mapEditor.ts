module Vienna.Widgets.Map {
    export class MapEditor implements IWidgetEditor<Map.Map> {
        private map: KnockoutObservable<Map.Map>;
        private viewManager: Ui.ViewManager;

        public location: KnockoutObservable<string>;
        public caption: KnockoutObservable<string>;
        public zoomControl: KnockoutObservable<boolean>;
        public layout: KnockoutObservable<string>;


        constructor(viewManager: Ui.ViewManager) {
            this.viewManager = viewManager;

            this.onLocationUpdate = this.onLocationUpdate.bind(this);
            this.onCaptionUpdate = this.onCaptionUpdate.bind(this);
            this.onLayoutUpdate = this.onLayoutUpdate.bind(this);
            this.onZoomControlUpdate = this.onZoomControlUpdate.bind(this);
            this.closeEditor = this.closeEditor.bind(this);

            this.location = ko.observable<string>();
            this.location.subscribe(this.onLocationUpdate);

            this.caption = ko.observable<string>();
            this.caption.subscribe(this.onCaptionUpdate);

            this.zoomControl = ko.observable<boolean>(false);
            this.zoomControl.subscribe(this.onZoomControlUpdate);

            this.layout = ko.observable<string>();
            this.layout.subscribe(this.onLayoutUpdate);

            this.map = ko.observable<Map.Map>();
        }

        private onCaptionUpdate(caption: string): void {
            this.map().caption(caption);
        }

        private onLayoutUpdate(layout: string): void {
            this.map().layout(layout);
        }

        private onLocationUpdate(sourceUrl: string): void {
            this.map().location(sourceUrl);
        }

        private onZoomControlUpdate(enabled: boolean): void {
            if (enabled)
                this.map().zoomControl("show");
            else
                this.map().zoomControl("hide");
        }

        public setWidgetViewModel(map: Map.Map): void {
            this.map(map);
            this.location(map.location());
            this.caption(map.caption());
            this.layout(map.layout());
            this.zoomControl(this.map().zoomControl() === "show");
        }

        public closeEditor(): void {
            this.viewManager.closeWidgetEditor();
        }
    }
}
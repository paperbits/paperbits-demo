module Vienna {
    export module Workshops {
        export class Workshops {
            private viewManager: Vienna.Ui.ViewManager;

            public journey: KnockoutObservable<string>;
            public dragging: KnockoutObservable<boolean>;

            constructor(viewManager: Vienna.Ui.ViewManager) {
                this.viewManager = viewManager;

                this.closeJourney = this.closeJourney.bind(this);

                this.journey = ko.observable<string>();
                this.dragging = ko.observable<boolean>(false);
            }

            public openPages() {
                this.viewManager.newJourney("Pages", "pages");
                this.journey("pages");
            }

            public openMedia() {
                this.viewManager.newJourney("Media", "media");
                this.journey("media");
            }

            public openNavigation() {
                this.viewManager.newJourney("Navigation", "navigation");
                this.journey("navigation");
            }

            public openSettings() {
                this.viewManager.newJourney("Settings", "settings");
                this.journey("settings");
            }

            public openWidgets() {
                this.viewManager.newJourney("Widgets", "widgets");
                this.journey("widgets");
            }

            public closeJourney() {
                this.journey();
                this.viewManager.clearJourney();
            }
        }
    }
}
module Vienna {
    export class NavbarItem {
        public label: KnockoutObservable<string>;
        public url: KnockoutObservable<string>;
        public nodes: KnockoutObservableArray<NavbarItem>;

        constructor(label: string, url: string) {
            this.label = ko.observable<string>(label);
            this.url = ko.observable<string>(url);
            this.nodes = ko.observableArray<NavbarItem>();
        }
    }
}

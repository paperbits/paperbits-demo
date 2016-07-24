module Vienna.Editing {
    import IPermalink = Vienna.Data.IPermalink;
    export class HyperlinkEditor implements Widgets.IWidgetEditor<HTMLLinkElement> {
        private htmlEditor: Editing.IHtmlEditor;
        private hyperlink: HTMLLinkElement;

        public viewManager: Vienna.Ui.ViewManager;

        public hyperlinkSelected: KnockoutObservable<boolean>;
        public type: KnockoutObservable<string>;
        public href: KnockoutObservable<string>;
        public isOpen: KnockoutObservable<boolean>;
        public selectedLinkType: KnockoutObservable<string>;

        constructor(htmlEditor: Editing.IHtmlEditor, viewManager: Vienna.Ui.ViewManager) {
            this.htmlEditor = htmlEditor;
            this.viewManager = viewManager;

            this.setWidgetViewModel = this.setWidgetViewModel.bind(this);
            this.onOpen = this.onOpen.bind(this);
            this.updateHyperlink = this.updateHyperlink.bind(this);
            this.removeHyperlink = this.removeHyperlink.bind(this);
            this.updateHyperlinkState = this.updateHyperlinkState.bind(this);
            this.openPageSelector = this.openPageSelector.bind(this);
            this.openMediaSelector = this.openMediaSelector.bind(this);
            this.onLinkItemSelected = this.onLinkItemSelected.bind(this);

            this.hyperlinkSelected = ko.observable<boolean>(false);
            this.selectedLinkType = ko.observable<string>();
            this.href = ko.observable<string>();
            this.href.subscribe(this.updateHyperlink);
            this.isOpen = ko.observable<boolean>(false);
            this.isOpen.subscribe(this.onOpen);

            this.htmlEditor.addSelectionChangeListener(this.updateHyperlinkState);

            //TODO: Make separate component and inlcude it into balloon content as tag <hyperlink-editor>
        }

        private updateHyperlinkState() {
            let selectionState = this.htmlEditor.getState();
            this.hyperlinkSelected(selectionState.hyperlink);
        }

        private updateHyperlink(href: string) {
            href = href || "/";
            this.hyperlink.setAttribute("href", href);
        }

        private onLinkItemSelected(permaLink: IPermalink){
            if(permaLink) {
                this.href(permaLink.uri);
            }
            this.viewManager.closeWidgetEditor();
        }

        public openPageSelector(){
            this.viewManager.itemSelectorName("page-selector");
            this.viewManager.setWidgetEditor({ name: "page-selector", params: this.onLinkItemSelected });
        }

        public openMediaSelector(){
            this.viewManager.itemSelectorName("media-selector");
            this.viewManager.setWidgetEditor({ name: "media-selector", params: this.onLinkItemSelected });
        }

        public removeHyperlink(): void {
            this.htmlEditor.removeHyperlink();
            this.isOpen(false);
        }

        public setWidgetViewModel(hyperlink: HTMLLinkElement): void {
            if(hyperlink){
                this.hyperlink = hyperlink;
                let link = hyperlink.getAttribute("href");
                this.href(link);
            } else {
                this.hyperlink = null;
                this.href(null);
            }
            this.selectedLinkType(null);
        }

        public onOpen(open: boolean) {
            if (!open) {
                return;
            }

            this.setWidgetViewModel(this.htmlEditor.hyperlink());
        }
    }
}

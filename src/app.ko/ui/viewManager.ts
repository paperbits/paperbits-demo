/// <reference path="../../app/ui/iviewmanager.ts" />

module Vienna.Ui {
    export class ViewManager implements IViewManager {
        private eventManager: IEventManager;
        private mediaService: Data.IMediaService;
        private htmlEditor: Editing.IHtmlEditor;
        private globalEventHandler: GlobalEventHandler;

        public journey: KnockoutObservableArray<IComponent>;
        public journeyName: KnockoutObservable<string>;
        public itemSelectorName: KnockoutObservable<string>;
        public currentItemSelectorName: string;
        public progressIndicators: KnockoutObservableArray<ProgressIndicator>;
        public primaryToolboxVisible: KnockoutObservable<boolean>;
        public contextualToolboxVisible: KnockoutObservable<boolean>;
        public widgetEditor: KnockoutObservable<IComponent>;

        constructor(mediaService: Data.IMediaService, htmlEditor: Editing.IHtmlEditor, eventManager: IEventManager, globalEventHandler: GlobalEventHandler) {
            this.progressIndicators = ko.observableArray<ProgressIndicator>();
            this.mediaService = mediaService;
            this.htmlEditor = htmlEditor;
            this.eventManager = eventManager;
            this.globalEventHandler = globalEventHandler;

            // rebinding...
            this.addProgressIndicator = this.addProgressIndicator.bind(this);
            this.addPromiseProgressIndicator = this.addPromiseProgressIndicator.bind(this);
            this.openWorkshop = this.openWorkshop.bind(this);
            this.scheduleIndicatorRemoval = this.scheduleIndicatorRemoval.bind(this);
            this.updateJourneyComponent = this.updateJourneyComponent.bind(this);
            this.clearJourney = this.clearJourney.bind(this);
            this.setWidgetEditor = this.setWidgetEditor.bind(this);
            this.foldEverything = this.foldEverything.bind(this);
            this.unfoldEverything = this.unfoldEverything.bind(this);
            this.closeWidgetEditor = this.closeWidgetEditor.bind(this);

            // setting up...
            this.journey = ko.observableArray<IComponent>();
            this.journeyName = ko.observable<string>();
            this.itemSelectorName = ko.observable<string>(null);
            this.currentItemSelectorName = "";
            this.widgetEditor = ko.observable<IComponent>();

            this.primaryToolboxVisible = ko.observable<boolean>(true);
            this.contextualToolboxVisible = ko.observable<boolean>(true);

            this.htmlEditor.addSelectionChangeListener(this.clearJourney);
            this.globalEventHandler.addDragEnterListener(this.foldEverything);
            this.globalEventHandler.addDragDropListener(this.unfoldEverything);
            this.globalEventHandler.addDragEndListener(this.unfoldEverything);
            this.globalEventHandler.addDragLeaveScreenListener(this.unfoldEverything);

            document.addEventListener("click", function (event) {
                if ($(event.target).closest("workshops").length === 0 &&
                    this.currentItemSelectorName != this.itemSelectorName()) {
                    this.clearJourney();
                }
            }.bind(this), true);
        }

        public addProgressIndicator(title: string, content: string, progress?: number) {
            var indicator = new ProgressIndicator(title, content, progress);
            this.progressIndicators.push(indicator);
            this.scheduleIndicatorRemoval(indicator);
        }

        public addPromiseProgressIndicator<T>(task: ProgressPromise<T>, title: string, content: string) {
            var indicator = new ProgressIndicator(title, content);

            this.progressIndicators.push(indicator);

            task.progress(indicator.progress);
            task.then(() => {
                indicator.complete(true);
            });

            task.then(() => {
                this.scheduleIndicatorRemoval(indicator);
            });
        }

        public newJourney(journeyName: string, componentName: string, parameters?: any) {
            this.clearJourney();
            this.journeyName(journeyName);
            this.openWorkshop(componentName, parameters);
            this.widgetEditor(null);
        }

        public updateJourneyComponent(component: IComponent) {
            var result = this.journey();

            var existingComponent = result.first(c => { return c.name === component.name; });

            if (existingComponent) {
                result = result.splice(0, result.indexOf(existingComponent));
            }
            result.push(component);

            this.journey(result);
        }

        public clearJourney(): void {
            this.journey([]);
            this.itemSelectorName(null);
        }

        public foldWorkshops(): void {
            this.journey([]);
            this.primaryToolboxVisible(false);
        }

        public unfoldWorkshop(): void {
            this.primaryToolboxVisible(true);
        }

        public foldEverything(): void {
            this.foldWorkshops();
            this.contextualToolboxVisible(false);
        }

        public unfoldEverything(): void {
            this.primaryToolboxVisible(true);
            this.contextualToolboxVisible(true);
        }

        public openWorkshop(componentName: string, parameters?: any) {
            var component: IComponent = {
                name: componentName,
                params: parameters
            };
            this.updateJourneyComponent(component);
        }

        public closeWorkshop(componentName: string) {
            var result = this.journey();

            var existingComponent = result.first(c => { return c.name === componentName; });

            if (existingComponent) {
                result = result.splice(0, result.indexOf(existingComponent));
            }

            this.journey(result);
        }

        private scheduleIndicatorRemoval(indicator: ProgressIndicator) {
            setTimeout(() => {
                this.progressIndicators(_.without(this.progressIndicators(), indicator));
            }, 10000);
        }

        public openUploadDialog(): Promise<Array<File>> {
            //TODO: Make normal uploader component of it. No jquery should be here.
            var $genericUploader = $("<input type='file' multiple />");
            var genericUploader: any = $genericUploader[0];

            $genericUploader.click();

            return new Promise<Array<File>>((resolve, reject) => {
                $genericUploader.change(() => {
                    resolve(genericUploader.files);
                });
            });
        }

        public setWidgetEditor(widgetEditorComponent: IComponent) {
            this.currentItemSelectorName = widgetEditorComponent.name;
            this.widgetEditor(widgetEditorComponent);
        }

        public closeWidgetEditor() {
            this.currentItemSelectorName = "";
            this.itemSelectorName(null);
            this.widgetEditor(null);
        }
    }
}
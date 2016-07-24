module Vienna.Workshops {
    import IPage = Vienna.Data.IPage;
    import IPermalink = Vienna.Data.IPermalink;
    import IMediaService = Vienna.Data.IMediaService;
    import IRouteHandler = Vienna.IRouteHandler;
    import ViewManager = Vienna.Ui.ViewManager;
    import LayoutEditor = Vienna.Editing.LayoutEditor;
    import IContentDropHandler = Vienna.Editing.IContentDropHandler;
    import MediaItem = Vienna.Workshops.MediaItem;
    import IMedia = Vienna.Data.IMedia;

    export class MediaWorkshop {
        private mediaService: IMediaService;
        private permalinkService: IPermalinkService;
        private viewManager: ViewManager;
        private layoutEditor: LayoutEditor;
        private dropHandlers: Array<IContentDropHandler>;

        public searchPattern: KnockoutObservable<string>;
        public mediaReferences: KnockoutObservableArray<MediaItem>;

        constructor(mediaService: IMediaService, permalinkService: IPermalinkService, viewManager: ViewManager, layoutEditor: LayoutEditor, dropHandlers: Array<IContentDropHandler>) {
            // initialization...
            this.mediaService = mediaService;
            this.permalinkService = permalinkService;
            this.viewManager = viewManager;
            this.layoutEditor = layoutEditor;
            this.dropHandlers = dropHandlers;

            // rebinding...
            //this.onFaviconUploaded = this.onFaviconUploaded.bind(this);
            this.onSearchPatternChange = this.onSearchPatternChange.bind(this);
            this.uploadMedia = this.uploadMedia.bind(this);
            this.onMediaUploaded = this.onMediaUploaded.bind(this);
            this.onDragStart = this.onDragStart.bind(this);
            this.onDragEnd = this.onDragEnd.bind(this);

            // setting up...
            this.mediaReferences = ko.observableArray<MediaItem>();
            this.searchPattern = ko.observable<string>();

            this.searchPattern.subscribe(this.onSearchPatternChange);
            this.onSearchPatternChange("");
        }

        public onSearchPatternChange(searchPattern: string): void {
            var searchMediaPromise = this.mediaService.search(searchPattern);
            var drophandlers = this.dropHandlers;
            var result: Array<MediaItem> = [];

            searchMediaPromise.then((mediaReferences: Array<IMedia>) => {
                mediaReferences.forEach(media => {
                    for (var i = 0; i < drophandlers.length; i++) {
                        var descriptor = drophandlers[i].getContentDescriptorByMedia(media);

                        //TODO: Move this logic to drag start. MediaItem can get descriptor byitself;
                        if (descriptor && descriptor.getWidgetOrder) {
                            descriptor.getWidgetOrder().then((order: Editing.IWidgetOrder) => {
                                var mediaItem = new Vienna.Workshops.MediaItem();
                                mediaItem.filename = media.filename;
                                mediaItem.widgetOrder = order;
                                this.mediaReferences.push(mediaItem);
                            });
                            break;
                        }
                    }
                });

                this.mediaReferences(result);
            });

            searchMediaPromise.catch(() => {
                //TODO
            });
        }

        private onMediaUploaded(): void {
            this.onSearchPatternChange("");
        }

        public uploadMedia(): void {
            this.viewManager.openUploadDialog().then((files: Array<File>) => {
                for (var index = 0; index < files.length; index++) {
                    let file = files[index];

                    var uploadPromise = this.mediaService.createMedia(file);

                    this.viewManager.addPromiseProgressIndicator(uploadPromise, "Upload to media library", file.name);

                    uploadPromise.then((media: IMedia) => {
                        this.permalinkService
                            .createPermalink("media/{0}".format(file.name), media.key)
                            .then((permalink: IPermalink) => {
                                media.permalinkKey = permalink.key;

                                this.mediaService.updateMedia(media).then(() => {
                                    this.onMediaUploaded();
                                })
                            });
                    });              
                }
            });
        }

        public onDragStart(item: MediaItem): HTMLElement {
            this.viewManager.foldEverything();
            var widgetElement = item.widgetOrder.factory().element;
            item.element = widgetElement;
            return widgetElement;
        }

        public onDragEnd(item: MediaItem): void {
            this.layoutEditor.onWidgetDragEnd(item, item.element);
            this.layoutEditor.applyBindingsToWidget(item.element);
        }
    }
}
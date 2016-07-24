module Vienna {
    import LayoutEditor = Vienna.Editing.LayoutEditor;
    import IMediaService = Data.IMediaService;
    import IContentDropHandler = Editing.IContentDropHandler;
    import ViewManager = Ui.IViewManager;
    import IContentDescriptor = Editing.IContentDescriptor;

    export module Workshops {
        /*
           - Drop bucket introduces a special container for dropping content,
             which, if supported, could be picked up by a widget;

           - If dropped content is supported by several widgets (i.e. Bing and Google maps), user will be able to choose;
           
           - All KNOWN content is dragged only from Vienna UI with attached context;
           
           - Widget/Content handler registrations should be injected in respective order;
        */
        export class DropBucket {
            private dropHandlers: Array<IContentDropHandler>;
            private mediaService: IMediaService;
            private unknownContentDropHandler: IContentDropHandler;
            private viewManger: Ui.IViewManager;

            public layoutEditor: LayoutEditor;
            public droppedItems: KnockoutObservableArray<DropBucketItem>;

            constructor(globalEventHandler: GlobalEventHandler, layoutEditor: LayoutEditor, mediaService: IMediaService, dropHandlers: Array<IContentDropHandler>, viewManager: ViewManager) {
                this.layoutEditor = layoutEditor;
                this.mediaService = mediaService;
                this.viewManger = viewManager;

                this.onDragDrop = this.onDragDrop.bind(this);
                this.onDragStart = this.onDragStart.bind(this);
                this.onDragEnd = this.onDragEnd.bind(this);
                this.onPaste = this.onPaste.bind(this);
                this.addPendingContent = this.addPendingContent.bind(this);
                this.uploadContentAsMedia = this.uploadContentAsMedia.bind(this);
                this.discardDroppedContent = this.discardDroppedContent.bind(this);
                this.handleDroppedContent = this.handleDroppedContent.bind(this);
                this.handleUnknownContent = this.handleUnknownContent.bind(this);

                globalEventHandler.addDragDropListener(this.onDragDrop);
                globalEventHandler.addPasteListener(this.onPaste);

                this.dropHandlers = dropHandlers;
                this.droppedItems = ko.observableArray<DropBucketItem>();
            }

            private isDraggableAttached(event: DragEvent): boolean {
                var text = event.dataTransfer.getData("text");

                return text != null && text.startsWith(Editing.DataTransferTypes.widget);
            }

            private addPendingContent(item: DropBucketItem): void {
                this.droppedItems.push(item);
            }

            private handleDroppedContent(contentDescriptor: IContentDescriptor) {
                var dropBucketItem = new DropBucketItem();

                dropBucketItem.title = contentDescriptor.title;
                dropBucketItem.description = contentDescriptor.description;

                var dropBucketItemTasks = new Array<Promise<any>>();

                if (contentDescriptor.getWidgetOrder) {
                    var getWidgetOrderTask = contentDescriptor.getWidgetOrder();

                    getWidgetOrderTask.then((widgetOrder: Editing.IWidgetOrder) => {
                        dropBucketItem.widgetOrder(widgetOrder);
                    });

                    dropBucketItemTasks.push(getWidgetOrderTask);
                }

                dropBucketItem.previewUrl = contentDescriptor.previewUrl;
                dropBucketItem.thumbnailUrl = contentDescriptor.thumbnailUrl;

                if (contentDescriptor.uploadables && contentDescriptor.uploadables.length) {
                    var urlTasks: Promise<void>[] = [];

                    for (var i = 0; i < contentDescriptor.uploadables.length; i++) {
                        var uploadable = contentDescriptor.uploadables[i];
                        if (typeof (uploadable) === "string") {
                            urlTasks.push(new Promise<void>((resolve, reject) => {
                                $.ajax({
                                    type: "HEAD",
                                    url: <string>uploadable,
                                    success: (data, status, jqXHR) => {
                                        var length = <any>jqXHR.getResponseHeader("content-length") * 1;
                                        if (length && length < 1024 * 1024 * 5) {
                                            dropBucketItem.uploadables.push(uploadable);
                                        }
                                        resolve();
                                    },
                                    error: reject
                                });
                            }));
                        } else {
                            dropBucketItem.uploadables.push(uploadable);
                        }
                    }

                    if (urlTasks.length > 0) {
                        dropBucketItem.uploadablesPending = Promise.all(urlTasks);
                    }
                }

                this.addPendingContent(dropBucketItem);
            }

            private onDragDrop(event: DragEvent): void {
                if (this.isDraggableAttached(event)) {
                    return;
                }

                this.droppedItems.removeAll();

                var dataTransfer = event.dataTransfer;
                var i = 0;
                var contentDescriptor: Editing.IContentDescriptor = null;
                var handled = false;

                while (contentDescriptor === null && i < this.dropHandlers.length) {
                    contentDescriptor = this.dropHandlers[i].getContentDescriptorByDataTransfer({
                        getData: dataTransfer.getData.bind(dataTransfer),
                        files: <File[]><any>dataTransfer.files
                    });

                    if (contentDescriptor) {
                        this.handleDroppedContent(contentDescriptor);
                        handled = true;
                    }
                    i++;
                }

                if (!handled) { // none found
                    this.handleUnknownContent(dataTransfer);
                }
            }

            private onPaste(event: ClipboardEvent) {
                this.droppedItems.removeAll();
                var text = event.clipboardData.getData("text");
                var i = 0;
                var contentDescriptor: Editing.IContentDescriptor = null;
                while (contentDescriptor === null && i < this.dropHandlers.length) {
                    contentDescriptor = this.dropHandlers[i].getContentDescriptorByDataTransfer({
                        getData: format => format == "text" || format == "url" ? text : null,
                        files: <File[]>[]
                    });

                    if (contentDescriptor) {
                        this.handleDroppedContent(contentDescriptor);
                    }

                    i++;
                }
            }

            private handleUnknownContent(dataTransfer: DataTransfer) {
                var title: string;
                var description: string = "";

                if (dataTransfer.files.length > 1) {
                    title = "{0} files".format(dataTransfer.files.length);
                }
                else if (dataTransfer.files.length > 0) {
                    title = "File";
                    description = dataTransfer.files[0].name;
                }
                else {
                    title = "Piece of text";
                }

                var dropBucketItem = new DropBucketItem();
                var uploadables = [];

                for (var i = 0; i < dataTransfer.files.length; i++) {
                    uploadables.push(dataTransfer.files[i]);
                }

                dropBucketItem.title = title;
                dropBucketItem.description = description;
                dropBucketItem.uploadables(uploadables);

                this.addPendingContent(dropBucketItem);
            }

            public onDragStart(item: DropBucketItem): HTMLElement {
                item.widget = item.widgetOrder().factory();

                var widgetElement = item.widget.element;

                this.droppedItems.remove(item);

                return widgetElement;
            }

            public onDragEnd(dropbucketItem: DropBucketItem): void {
                this.layoutEditor.onWidgetDragEnd(dropbucketItem, dropbucketItem.widget.element);
                this.layoutEditor.applyBindingsToWidget(dropbucketItem.widget.element);
                this.droppedItems.remove(dropbucketItem);

                var onFileUploaded = dropbucketItem.widget.mediaUploaded
                    ? (uploadable: File | string, media: Data.IMedia) => dropbucketItem.widget.mediaUploaded(uploadable, media.permalinkKey)
                    : null;

                var uploadables = dropbucketItem.uploadables();

                if (uploadables && uploadables.length > 0) {
                    if (dropbucketItem.uploadablesPending) {
                        dropbucketItem.uploadablesPending.then(() => this.uploadContentAsMedia(dropbucketItem, onFileUploaded));
                    }
                    else {
                        this.uploadContentAsMedia(dropbucketItem, onFileUploaded);
                        this.droppedItems.remove(dropbucketItem);
                    }
                }
            }

            public uploadContentAsMedia(dropbucketItem: DropBucketItem, callback: (uploadable: File | string, media: Data.IMedia) => void): void {
                var uploadables = dropbucketItem.uploadables();

                this.droppedItems.remove(dropbucketItem);

                uploadables.forEach(item => {
                    var uploadPromise: ProgressPromise<Data.IMedia>;

                    if (typeof (item) === "string") {
                        uploadPromise = this.mediaService.uploadFromUrl(<string>item);
                        this.viewManger.addPromiseProgressIndicator(uploadPromise, "Upload to media library", <string>item);
                    } else {
                        uploadPromise = this.mediaService.createMedia(<File>item);
                        this.viewManger.addPromiseProgressIndicator(uploadPromise, "Upload to media library", (<File>item).name);
                    }
                    if (callback && typeof callback === "function") { //VK: Called by KO binding, so 2nd argument may be an event
                        uploadPromise.then(media => callback(item, media));
                    }
                });
            }

            public discardDroppedContent(): void {
                this.droppedItems.removeAll();
            }
        }
    }
}
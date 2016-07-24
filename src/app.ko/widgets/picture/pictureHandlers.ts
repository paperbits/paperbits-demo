/// <reference path="../mediaHandlers.ts" />

module Vienna.Widgets.Picture {
    import IFileStorage = Vienna.Persistence.IFileStorage;
    import IPermalink = Vienna.Data.IPermalink;
    import PictureViewModel = Vienna.Widgets.Picture.PictureViewModel;

    export const nodeName = "paper-picture";

    export class PictureHandlers extends MediaHandlers implements Editing.IWidgetable, Editing.IContentDropHandler {
        private fileStorage: IFileStorage;
        private permalinkService: IPermalinkService;

        constructor(fileStorage: IFileStorage, permalinkService: IPermalinkService) {
            super(["image/"], [".jpg", ".jpeg", ".png", ".svg", ".gif"]);

            this.fileStorage = fileStorage;
            this.permalinkService = permalinkService;
        }

        public getWidgetOrder(): Promise<Editing.IWidgetOrder> {
            var config: PictureHandlers.IPictureConfig = { src: "http://placehold.it/800x600", caption: "Picture" };

            return Promise.resolve(this.getWidgetOrderByConfig(config));
        }

        protected getContentDescriptor(item: IMediaItem): Editing.IContentDescriptor {
            var dataUrlTaskFactory: () => Promise<string>;

            if (item.file) {
                var dataUrlPromise: Promise<string>;
                dataUrlTaskFactory = () => dataUrlPromise || (dataUrlPromise = this.readFileAsDataUrl(item.file));
            }

            var url = dataUrlTaskFactory ? Vienna.Tasks.TaskToDelayedComputed(dataUrlTaskFactory, "") : ko.observable(item.url);

            var descriptor: Editing.IContentDescriptor = {
                title: "Picture",
                description: item.name,
                getWidgetOrder: (): Promise<Editing.IWidgetOrder> => {
                    if (dataUrlTaskFactory) {
                        return dataUrlTaskFactory().then(url => {
                            return this.getWidgetOrderByConfig({
                                src: url,
                                caption: item.name
                            });
                        });
                    }
                    else {
                        return Promise.resolve(this.getWidgetOrderByConfig({
                            src: item.url,
                            caption: item.name
                        }));
                    }
                },
                previewUrl: url,
                thumbnailUrl: url,
                uploadables: [item.file ? item.file : item.url]
            };

            return descriptor;
        }

        public getContentDescriptorByMedia(item: Vienna.Data.IMedia): Editing.IContentDescriptor {
            var descriptor: Editing.IContentDescriptor = {
                title: "Picture",
                description: item.filename,
                getWidgetOrder: (): Promise<Editing.IWidgetOrder> => {
                    //TODO: Expensive!!! Since it's called for each list item.

                    return Promise.resolve(this.getWidgetOrderByMedia(item));
                }
            };

            return descriptor;
        }

        private readFileAsDataUrl(file: File): Promise<string> {
            return new Promise<string>((resolve, reject) => {
                var reader = new FileReader();

                reader.onload = (event: any) => {
                    var dataUrl = event.target.result;
                    resolve(dataUrl);
                };

                reader.onprogress = (progressEvent: ProgressEvent) => {
                    if (progressEvent.lengthComputable) {
                        var percentLoaded = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    }
                };

                reader.readAsDataURL(file);
            });
        }

        private getWidgetOrderByMedia(item: Vienna.Data.IMedia): Editing.IWidgetOrder {
            var newPictureConfig = { src: item.downloadUrl, caption: item.filename };

            var widgetOrder: Editing.IWidgetOrder = {
                title: "Picture",
                factory: () => {
                    var pictureHtmlElement = Utils.createComponent(nodeName, newPictureConfig);

                    setTimeout(() => { //TODO: Fix. It's awaiting view model to create.
                        var viewModel = <PictureViewModel>ko.dataFor(((<any>pictureHtmlElement).shadowRoot || pictureHtmlElement).children[0]);
                        viewModel.setPermalink(item.permalinkKey);

                    }, 1000);

                    var widgetFactoryResult = this.toWidgetFactoryResult<PictureViewModel>(pictureHtmlElement);

                    return widgetFactoryResult;
                }
            }

            return widgetOrder;
        }

        private getWidgetOrderByConfig(pictureConfig: PictureHandlers.IPictureConfig): Editing.IWidgetOrder {
            var newPictureConfig = { src: pictureConfig.src, caption: pictureConfig.caption };

            var widgetOrder: Editing.IWidgetOrder = {
                title: "Picture",
                factory: () => {
                    var pictureHtmlElement = Utils.createComponent(nodeName, newPictureConfig);

                    var onMediaUploaded = (pictureViewModel: PictureViewModel, source: File | string, permalinkKey: string) => {
                        pictureViewModel.setPermalink(permalinkKey);
                    }

                    var widgetFactoryResult = this.toWidgetFactoryResult<PictureViewModel>(pictureHtmlElement, onMediaUploaded);

                    return widgetFactoryResult;
                }
            }

            return widgetOrder;
        }
    }

    export module PictureHandlers {
        export interface IPictureConfig {
            src: string;
            caption: string;
        }
    }
}
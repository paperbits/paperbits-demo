module Vienna.Widgets.Picture {
    import IMediaService = Vienna.Data.IMediaService;
    import IMedia = Vienna.Data.IMedia;
    import IPermalink = Vienna.Data.IPermalink;

    export class PictureEditor implements IWidgetEditor<Picture> {
        private picture: KnockoutObservable<Picture>;
        private viewManager: Ui.ViewManager;
        private mediaService: IMediaService;
        private permalinkService: IPermalinkService;

        public sourceUrl: KnockoutObservable<string>;
        public caption: KnockoutObservable<string>;
        public action: KnockoutObservable<string>;
        public layout: KnockoutObservable<string>;
        public animation: KnockoutObservable<string>;

        constructor(viewManager: Ui.ViewManager, mediaService: IMediaService, permalinkService: IPermalinkService, eventManager: IEventManager) {
            this.viewManager = viewManager;
            this.mediaService = mediaService;
            this.permalinkService = permalinkService;

            this.onSourceUrlUpdate = this.onSourceUrlUpdate.bind(this);
            this.onCaptionUpdate = this.onCaptionUpdate.bind(this);
            this.onLayoutUpdate = this.onLayoutUpdate.bind(this);
            this.onAnimationUpdate = this.onAnimationUpdate.bind(this);
            this.uploadMedia = this.uploadMedia.bind(this);
            this.closeEditor = this.closeEditor.bind(this);

            this.sourceUrl = ko.observable<string>();
            this.sourceUrl.subscribe(this.onSourceUrlUpdate);

            this.caption = ko.observable<string>();
            this.caption.subscribe(this.onCaptionUpdate);

            this.action = ko.observable<string>();
            this.layout = ko.observable<string>();
            this.layout.subscribe(this.onLayoutUpdate);

            this.animation = ko.observable<string>();
            this.animation.subscribe(this.onAnimationUpdate);

            this.picture = ko.observable<Picture>();

            eventManager.addEventListener("onEscape", this.closeEditor);
        }

        private onCaptionUpdate(caption: string): void {
            this.picture().caption(caption);
        }

        private onLayoutUpdate(layout: string): void {
            this.picture().layout(layout);
        }

        private onAnimationUpdate(layout: string): void {
            this.picture().animation(layout);
        }

        private onSourceUrlUpdate(sourceUrl: string): void {
            this.picture().sourceUrl(sourceUrl);
        }

        public setWidgetViewModel(picture: Picture): void {
            this.picture(picture);
            this.sourceUrl(picture.sourceUrl());
            this.caption(picture.caption());
            this.layout(picture.layout());
            this.animation(picture.animation());
        }

        public uploadMedia(): void {
            this.viewManager.openUploadDialog().then((files: Array<File>) => {
                for (var index = 0; index < files.length; index++) {
                    let file = files[index];

                    this.mediaService.createMedia(file).then((media: IMedia) => {
                        this.permalinkService.createPermalink("media/{0}".format(file.name), media.key).then((permalink: IPermalink) => {
                            media.permalinkKey = permalink.key;

                            this.mediaService.updateMedia(media).then(() => {
                                this.sourceUrl(media.downloadUrl)
                            })
                        });
                    });
                }
            });
        }

        public closeEditor(): void {
            this.viewManager.closeWidgetEditor();
        }
    }
}
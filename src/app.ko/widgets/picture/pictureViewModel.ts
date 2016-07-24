module Vienna.Widgets.Picture {
    import IPermalink = Vienna.Data.IPermalink;
    import IMedia = Vienna.Data.IMedia;
    import IMediaService = Vienna.Data.IMediaService;

    export class PictureViewModel extends Picture {
        private rawSourceUrl: KnockoutObservable<string>;
        private permalinkService: IPermalinkService;
        private mediaService: IMediaService;

        constructor(lightbox: Ui.ILightbox, permalinkService: IPermalinkService, mediaService: IMediaService) {
            super(lightbox);

            this.permalinkService = permalinkService;
            this.mediaService = mediaService;

            this.onRawSourceUrlUpdate = this.onRawSourceUrlUpdate.bind(this);
            this.rawSourceUrl = ko.observable<string>();
            this.rawSourceUrl.subscribe(this.onRawSourceUrlUpdate);
        }

        private onRawSourceUrlUpdate(newValue: string) {
            this.sourceUrl(newValue);
        }

        public setSourceUrl(sourceUrl: string) {
            this.sourceUrl(sourceUrl);
        }

        public setPermalink(permalinkKey: string) {
            this.permalinkService
                .getPermalinkByKey(permalinkKey)
                .then((permalink: IPermalink) => {
                    this.mediaService.getMediaByKey(permalink.targetKey).then((media: IMedia) => {
                        this.rawSourceUrl(permalink.uri);
                        this.sourceUrl(media.downloadUrl);
                    });
                });
        }

        public getStateMap(): any {
            return {
                src: this.rawSourceUrl,
                caption: this.caption,
                action: this.action,
                layout: ko.pureComputed<string>({
                    read: this.layout,
                    write: l => this.layout(l ? l : "polaroid")
                }),
                animation: this.animation
            }
        }
    }
}
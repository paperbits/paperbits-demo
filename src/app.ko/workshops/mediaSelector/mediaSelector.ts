module Vienna {
    export module Workshops {
        import IMediaService = Vienna.Data.IMediaService;
        import IPermalink = Vienna.Data.IPermalink;
        import IMedia = Vienna.Data.IMedia;
        export class MediaSelector {
            private mediaService: IMediaService;
            private permalinkService: IPermalinkService;
            private onMediaSelected: (permaLink: IPermalink) => void;
            public mediaItems: KnockoutObservableArray<IMedia>;

            constructor(mediaService: IMediaService, permalinkService: IPermalinkService, onMediaSelected: (permaLink: IPermalink) => void) {
                this.mediaService = mediaService;
                this.permalinkService = permalinkService;
                this.mediaItems = ko.observableArray<IMedia>();
                this.onMediaSelected = onMediaSelected;
                this.selectMediaItem = this.selectMediaItem.bind(this);
                this.closeEditor = this.closeEditor.bind(this);
                this.loadMediaItems();
            }

            public loadMediaItems() {
                let searchMediaItemsTask = this.mediaService.search(null);
                searchMediaItemsTask.then((mediaItems: Array<Data.IMedia>) => {
                    this.mediaItems(mediaItems);
                });
            }

            public selectMediaItem(mediaItem: IMedia) {
                if(mediaItem){
                    this.permalinkService.getPermalinkByKey(mediaItem.permalinkKey).then((result: IPermalink) =>{
                        this.onMediaSelected(result);
                    });
                } else {
                    this.onMediaSelected(null);
                }
            }

            public closeEditor(): void {
                this.onMediaSelected(null);
            }
        }
    }
}

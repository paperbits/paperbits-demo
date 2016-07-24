module Vienna {
    export module Workshops {
        import IPagesService = Vienna.ISiteService;
        import ViewManager = Vienna.Ui.ViewManager;
        import IMedia = Vienna.Data.IMedia;
        import IMediaService = Vienna.Data.IMediaService;
        import IPermalink = Vienna.Data.IPermalink;

        export class SettingsWorkshop {
            private mediaService: IMediaService;
            private permalinkService: IPermalinkService;
            private siteService: ISiteService;
            private viewManager: Vienna.Ui.ViewManager;

            public title: KnockoutObservable<string>;
            public description: KnockoutObservable<string>;
            public keywords: KnockoutObservable<string>;

            constructor(mediaService: IMediaService, permalinkService: IPermalinkService, siteService: ISiteService, viewManager: ViewManager) {
                // initialization...
                this.mediaService = mediaService;
                this.permalinkService = permalinkService;
                this.siteService = siteService;
                this.viewManager = viewManager;

                // rebinding...
                this.onFaviconUploaded = this.onFaviconUploaded.bind(this);
                this.uploadFavicon = this.uploadFavicon.bind(this);
                this.updateSiteTitle = this.updateSiteTitle.bind(this);
                this.updateSiteDescription = this.updateSiteDescription.bind(this);
                this.updateSiteKeywords = this.updateSiteKeywords.bind(this);

                // setting up...
                this.title = ko.observable<string>();
                this.title.subscribe(this.updateSiteTitle);

                this.description = ko.observable<string>();
                this.description.subscribe(this.updateSiteDescription);

                this.keywords = ko.observable<string>();
                this.keywords.subscribe(this.updateSiteKeywords);

                this.loadSettings();
            }

            private loadSettings() {
                var getSiteSettingsTask = this.siteService.getSiteSettings();

                getSiteSettingsTask.then((settings) => {
                    if(settings) {
                        this.title(settings.title);
                        this.description(settings.description);
                        this.keywords(settings.keywords);
                    }
                });
            }

            private updateSiteTitle(title: string) {
                this.siteService.setTitle(title);
            }

            private updateSiteDescription(description: string) {
                this.siteService.setDescription(description);
            }

            private updateSiteKeywords(keywords: string) {
                this.siteService.setKeywords(keywords);
            }

            private onFaviconUploaded(favicon: Vienna.Data.IMedia) {
                this.siteService.setFavicon(favicon);
            }

            public uploadFavicon() {
                this.viewManager.openUploadDialog().then((files: Array<File>) => {
                    for (var index = 0; index < files.length; index++) {
                        let file = files[index];

                        this.mediaService.createMedia(file).then((media: IMedia) => {
                            this.permalinkService.createPermalink("media/{0}".format(file.name), media.key).then((permalink: IPermalink) => {
                                media.permalinkKey = permalink.key;

                                this.mediaService.updateMedia(media).then(() => {
                                    this.onFaviconUploaded(media);
                                })
                            });
                        });
                    }
                });
            }
        }
    }
}
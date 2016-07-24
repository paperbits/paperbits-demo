module Vienna.Widgets.Video {
    export class VideoEditor implements IWidgetEditor<Video> {
        private video: KnockoutObservable<Video>;
        private viewManager: Ui.ViewManager;

        public sourceUrl: KnockoutObservable<string>;
        public controls: KnockoutObservable<boolean>;
        public autoplay: KnockoutObservable<boolean>;

        constructor(viewManager: Ui.ViewManager) {
            this.viewManager = viewManager;

            this.onSourceUrlUpdate = this.onSourceUrlUpdate.bind(this);
            this.onControlsUpdate = this.onControlsUpdate.bind(this);
            this.onAutoplayUpdate = this.onAutoplayUpdate.bind(this);
            this.uploadMedia = this.uploadMedia.bind(this);
            this.onMediaUploaded = this.onMediaUploaded.bind(this);
            this.closeEditor = this.closeEditor.bind(this);

            this.sourceUrl = ko.observable<string>();
            this.sourceUrl.subscribe(this.onSourceUrlUpdate);

            this.controls = ko.observable<boolean>(true);
            this.controls.subscribe(this.onControlsUpdate);

            this.autoplay = ko.observable<boolean>(false);
            this.autoplay.subscribe(this.onAutoplayUpdate);

            this.video = ko.observable<Video>();
        }

        private onControlsUpdate(controls: boolean): void {
            this.video().controls(controls ? true : null);
        }

        private onAutoplayUpdate(autoplay: boolean): void {
            this.video().autoplay(autoplay ? true : null);
        }

        private onSourceUrlUpdate(sourceUrl: string): void {
            this.video().sourceUrl(sourceUrl);
        }

        public setWidgetViewModel(video: Video): void {
            this.video(video);
            this.sourceUrl(video.sourceUrl());
            this.controls(video.controls());
            this.autoplay(video.autoplay());
        }

        public uploadMedia(): void {
            //this.viewManager.openUploadDialog(this.onMediaUploaded);
        }
        
        private onMediaUploaded(media: Data.IMedia): void {
            //this.sourceUrl(media.content);
        }

        public closeEditor(): void {
            this.viewManager.closeWidgetEditor();
        }
    }
}
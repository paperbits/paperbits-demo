/// <reference path="../mediaHandlers.ts" />

module Vienna.Widgets.Video {
    import MediaHandlers = Vienna.Widgets.MediaHandlers;
    import IFileStorage = Vienna.Persistence.IFileStorage;

    export class VideoHandlers extends MediaHandlers implements Editing.IWidgetable, Editing.IContentDropHandler {
        private fileStorage: IFileStorage;

        private static DefaultVideoUri = "http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_640x360.m4v";
        private static DefaultThumbnailUri = "data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%20standalone%3D%22no%22%3F%3E%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2270%22%20height%3D%2270%22%20version%3D%221.1%22%3E%3Crect%20width%3D%2270%22%20height%3D%2270%22%20x%3D%220%22%20y%3D%220%22%20%2F%3E%3Crect%20style%3D%22fill%3A%23ffffff%22%20width%3D%2250%22%20height%3D%2238%22%20x%3D%2210%22%20y%3D%2217%22%20ry%3D%222%22%20%2F%3E%3Crect%20style%3D%22fill%3A%23ffffff%22%20width%3D%227%22%20height%3D%225%22%20x%3D%222%22%20y%3D%2218%22%20ry%3D%221%22%20%2F%3E%3Crect%20style%3D%22fill%3A%23ffffff%22%20width%3D%227%22%20height%3D%225%22%20x%3D%222%22%20y%3D%2227%22%20ry%3D%221%22%20%2F%3E%3Crect%20style%3D%22fill%3A%23ffffff%22%20width%3D%2250%22%20height%3D%2238%22%20x%3D%2210%22%20y%3D%22-23%22%20ry%3D%222%22%20%2F%3E%3Crect%20style%3D%22fill%3A%23ffffff%22%20width%3D%2250%22%20height%3D%2238%22%20x%3D%2210%22%20y%3D%2257%22%20ry%3D%222%22%20%2F%3E%3Crect%20style%3D%22fill%3A%23ffffff%22%20width%3D%227%22%20height%3D%225%22%20x%3D%222%22%20y%3D%2236%22%20ry%3D%221%22%20%2F%3E%3Crect%20style%3D%22fill%3A%23ffffff%22%20width%3D%227%22%20height%3D%225%22%20x%3D%222%22%20y%3D%2245%22%20ry%3D%221%22%20%2F%3E%3Crect%20style%3D%22fill%3A%23ffffff%22%20width%3D%227%22%20height%3D%225%22%20x%3D%222%22%20y%3D%2254%22%20ry%3D%221%22%20%2F%3E%3Crect%20style%3D%22fill%3A%23ffffff%22%20width%3D%227%22%20height%3D%225%22%20x%3D%222%22%20y%3D%2263%22%20ry%3D%221%22%20%2F%3E%3Crect%20style%3D%22fill%3A%23ffffff%22%20width%3D%227%22%20height%3D%225%22%20x%3D%222%22%20y%3D%229%22%20ry%3D%221%22%20%2F%3E%3Crect%20style%3D%22fill%3A%23ffffff%22%20width%3D%227%22%20height%3D%225%22%20x%3D%222%22%20y%3D%220%22%20ry%3D%221%22%20%2F%3E%3Crect%20style%3D%22fill%3A%23ffffff%22%20width%3D%227%22%20height%3D%225%22%20x%3D%2261%22%20y%3D%2218%22%20ry%3D%221%22%20%2F%3E%3Crect%20style%3D%22fill%3A%23ffffff%22%20width%3D%227%22%20height%3D%225%22%20x%3D%2261%22%20y%3D%2227%22%20ry%3D%221%22%20%2F%3E%3Crect%20style%3D%22fill%3A%23ffffff%22%20width%3D%227%22%20height%3D%225%22%20x%3D%2261%22%20y%3D%2236%22%20ry%3D%221%22%20%2F%3E%3Crect%20style%3D%22fill%3A%23ffffff%22%20width%3D%227%22%20height%3D%225%22%20x%3D%2261%22%20y%3D%2245%22%20ry%3D%221%22%20%2F%3E%3Crect%20style%3D%22fill%3A%23ffffff%22%20width%3D%227%22%20height%3D%225%22%20x%3D%2261%22%20y%3D%2254%22%20ry%3D%221%22%20%2F%3E%3Crect%20style%3D%22fill%3A%23ffffff%22%20width%3D%227%22%20height%3D%225%22%20x%3D%2261%22%20y%3D%2263%22%20ry%3D%221%22%20%2F%3E%3Crect%20style%3D%22fill%3A%23ffffff%22%20width%3D%227%22%20height%3D%225%22%20x%3D%2261%22%20y%3D%229%22%20ry%3D%221%22%20%2F%3E%3Crect%20style%3D%22fill%3A%23ffffff%22%20width%3D%227%22%20height%3D%225%22%20x%3D%2261%22%20y%3D%220%22%20ry%3D%221%22%20%2F%3E%3Ccircle%20cx%3D%2235%22%20cy%3D%2236%22%20r%3D%2215%22%20%2F%3E%3Cpath%20style%3D%22fill%3A%23ffffff%22%20d%3D%22m%2045%2C35.999756%20-7.5%2C4.330127%20-7.5%2C4.330127%200%2C-8.660254%200%2C-8.660254%207.5%2C4.330127%20z%22%20%2F%3E%3Ccircle%20cx%3D%2235%22%20cy%3D%2276%22%20r%3D%2215%22%20%2F%3E%3Cpath%20style%3D%22fill%3A%23ffffff%22%20d%3D%22m%2045%2C75.999756%20-7.5%2C4.330127%20-7.5%2C4.330127%200%2C-8.660254%200%2C-8.660254%207.5%2C4.330127%20z%22%20%2F%3E%3Ccircle%20cx%3D%2235%22%20cy%3D%22-4%22%20r%3D%2215%22%20%2F%3E%3Cpath%20style%3D%22fill%3A%23ffffff%22%20d%3D%22m%2045%2C-5.999756%20-7.5%2C4.330127%20-7.5%2C4.330127%200%2C-8.660254%200%2C-8.660254%207.5%2C4.330127%20z%22%20%2F%3E%3C%2Fsvg%3E";
        private static ThumbnailTimeOffset = 60;

        constructor(fileStorage: IFileStorage) {
            super(["video/webm", "video/mp4", "video/ogg", "application/ogg"], [".webm", ".mp4", ".m4v", ".ogg", ".ogv", ".ogx", ".ogm"]);

            this.fileStorage = fileStorage;
        }

        protected getContentDescriptor(item: IMediaItem): Editing.IContentDescriptor {
            if (item.file) {
                item.url = URL.createObjectURL(item.file);
            }
            var thumbnailUrl = Vienna.Tasks.TaskToDelayedComputed(() => this.getThumbnailUrl(item.url), VideoHandlers.DefaultThumbnailUri);

            var descriptor: Editing.IContentDescriptor = {
                title: "Video",
                description: item.name,
                getWidgetOrder: () => Promise.resolve(this.getWidgetOrderByUrl(item.url)),
                previewUrl: thumbnailUrl,
                thumbnailUrl: thumbnailUrl,
                uploadables: [item.file ? item.file : item.url]
            };

            return descriptor;
        }

        public getContentDescriptorByMedia(item: Vienna.Data.IMedia): Editing.IContentDescriptor {
            return null;
        }

        private getWidgetOrderByUrl(url: string): Editing.IWidgetOrder {
            return {
                title: "Video",
                factory: () => this.toWidgetFactoryResult<Video>(Vienna.Utils.createComponent("paper-video", {
                    src: url,
                    controls: true
                }), (viewModel, source, uploadedUrl) => (<Video>viewModel).sourceUrl(uploadedUrl))
            };
        }

        private getThumbnailUrl(url: string): Promise<string> {
            return new Promise((resolve, reject) => {
                var video = <HTMLVideoElement>document.createElement("video");
                var canvas = <HTMLCanvasElement>document.createElement("canvas");
                var context = canvas.getContext("2d");

                video.addEventListener("loadedmetadata", function () {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                }, false);
                var callback = function () {
                    context.drawImage(video, 0, 0);
                    try {
                        var url = canvas.toDataURL();
                        resolve(url);
                    } catch (ex) {
                        resolve(VideoHandlers.DefaultThumbnailUri);
                    }
                    video.removeEventListener("timeupdate", callback, false);
                };
                video.addEventListener("timeupdate", callback, false);

                video.src = url;
                video.currentTime = VideoHandlers.ThumbnailTimeOffset;
            });
        }

        public getWidgetOrder(): Promise<Editing.IWidgetOrder> {
            return Promise.resolve(this.getWidgetOrderByUrl(VideoHandlers.DefaultVideoUri));
        }
    }
}